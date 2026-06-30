const CompatibilityRepository = require('../../repositories/compatibility.repository');
const TenantRepository = require('../../repositories/tenant.repository');
const RoomRepository = require('../../repositories/room.repository');
const ai = require('../../providers/gemini.provider');
const eventEmitter = require('../../shared/events/eventEmitter');
const { NotFoundError } = require('../../shared/errors');

class CompatibilityService {

  static async getRoomCompatibility(tenantId, roomId) {
    const cached = await CompatibilityRepository.findCachedScore(tenantId, roomId);
    if (cached) {
      console.info(`[METRIC] Cache Hit | Tenant: ${tenantId} | Room: ${roomId}`);
      return cached;
    }
    
    console.info(`[METRIC] Cache Miss | Generating score | Tenant: ${tenantId} | Room: ${roomId}`);
    return this.generateSingleScore(tenantId, roomId);
  }

  static async generateSingleScore(tenantId, roomId) {
    const profile = await TenantRepository.findProfileByUserId(tenantId);
    const room = await RoomRepository.findRoomById(roomId);

    if (!profile || !room) return null;

    return this.calculateAndStoreScore(profile, room);
  }

  static calculateFallbackScore(profile, room) {
    let score = 0;
    
    // Budget Match (40 pts)
    const rent = Number(room.rent);
    const min = Number(profile.minBudget);
    const max = Number(profile.maxBudget);
    if (rent >= min && rent <= max) score += 40;
    else if (rent < min) score += 30; // slightly cheaper is ok
    else if (rent > max && rent <= max + 5000) score += 20; // slightly over budget

    // Location Match (40 pts)
    const roomLoc = room.location.toLowerCase();
    const profLoc = profile.preferredLocation.toLowerCase();
    if (roomLoc.includes(profLoc) || profLoc.includes(roomLoc)) {
      score += 40;
    }

    // Move in Date (20 pts)
    if (new Date(room.availableFrom) <= new Date(profile.moveInDate)) {
      score += 20;
    }

    return {
      score,
      explanation: "Generated via deterministic fallback algorithm due to AI unavailability."
    };
  }

  static async calculateAndStoreScore(profile, room) {
    const startTime = Date.now();
    let scoreResult;

    try {
      if (!ai) throw new Error("Gemini API not configured.");

      const prompt = `
        Evaluate the compatibility between this tenant and room on a scale of 0 to 100.
        Return ONLY valid JSON with keys "score" (number) and "explanation" (string). Do not return markdown blocks like \`\`\`json. Return pure JSON string.

        Tenant Profile:
        Location: ${profile.preferredLocation}
        Budget: ${profile.minBudget} to ${profile.maxBudget}
        Move in: ${profile.moveInDate}

        Room Details:
        Location: ${room.location}
        Rent: ${room.rent}
        Available: ${room.availableFrom}
        Type: ${room.roomType}
        Furnishing: ${room.furnishingStatus}
        Description: ${room.description}
      `;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          temperature: 0.2
        }
      });
      
      let rawResponse = response.text().trim();
      // Safeguard against markdown blocks
      if (rawResponse.startsWith('```json')) {
        rawResponse = rawResponse.replace(/```json/g, '').replace(/```/g, '').trim();
      }

      scoreResult = JSON.parse(rawResponse);
      
      if (typeof scoreResult.score !== 'number' || typeof scoreResult.explanation !== 'string') {
        throw new Error('Invalid JSON structure from Gemini');
      }

      console.info(`[METRIC] Gemini Success | Duration: ${Date.now() - startTime}ms | Tenant: ${profile.userId} | Room: ${room.id}`);
    } catch (error) {
      console.warn(`[METRIC] Gemini Failure | Fallback Used | Duration: ${Date.now() - startTime}ms | Error: ${error.message}`);
      scoreResult = this.calculateFallbackScore(profile, room);
    }

    const saved = await CompatibilityRepository.upsertScore(
      profile.userId, 
      room.id, 
      scoreResult.score, 
      scoreResult.explanation
    );
    console.info(`[INFO] Score Saved: Tenant ${profile.userId} - Room ${room.id} -> ${scoreResult.score}`);
    return saved;
  }

  static async recalculateForTenant(tenantId) {
    const profile = await TenantRepository.findProfileByUserId(tenantId);
    if (!profile) return;

    const activeRooms = await CompatibilityRepository.findAllActiveRooms();
    
    // Process asynchronously to avoid blocking the caller
    for (const room of activeRooms) {
      if (room.ownerId !== tenantId) {
        await this.calculateAndStoreScore(profile, room);
      }
    }
  }

  static async recalculateForRoom(roomId) {
    const room = await RoomRepository.findRoomById(roomId);
    if (!room || room.isFilled) return;

    const tenants = await CompatibilityRepository.findAllTenants();

    // Process asynchronously to avoid blocking the caller
    for (const tenant of tenants) {
      if (tenant.userId !== room.ownerId) {
        await this.calculateAndStoreScore(tenant, room);
      }
    }
  }
}

module.exports = CompatibilityService;
