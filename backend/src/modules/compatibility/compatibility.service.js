const CompatibilityRepository = require('../../repositories/compatibility.repository');
const TenantRepository = require('../../repositories/tenant.repository');
const RoomRepository = require('../../repositories/room.repository');
const GroqCompatibilityService = require('./services/GroqCompatibilityService');
const RuleBasedCompatibilityService = require('./services/RuleBasedCompatibilityService');

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

  static async getTenantCompatibilities(tenantId) {
    return CompatibilityRepository.findAllByTenant(tenantId);
  }

  static async generateSingleScore(tenantId, roomId) {
    const profile = await TenantRepository.findProfileByUserId(tenantId);
    const room = await RoomRepository.findRoomById(roomId);

    if (!profile || !room) return null;

    return this.calculateAndStoreScore(profile, room);
  }

  static async calculateAndStoreScore(profile, room) {
    const startTime = Date.now();
    let scoreResult;

    try {
      scoreResult = await GroqCompatibilityService.calculateScore(profile, room);
      console.info(`[METRIC] Groq Success | Duration: ${Date.now() - startTime}ms | Tenant: ${profile.userId} | Room: ${room.id}`);
    } catch (error) {
      console.warn(`[METRIC] Groq Failure | Fallback Used | Duration: ${Date.now() - startTime}ms | Error: ${error.message}`);
      scoreResult = RuleBasedCompatibilityService.calculateScore(profile, room);
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

  static async askQuestion(tenantId, roomId, question) {
    const profile = await TenantRepository.findProfileByUserId(tenantId);
    const room = await RoomRepository.findRoomById(roomId);

    if (!profile) throw new Error('Tenant profile required to ask questions contextually.');
    if (!room) throw new Error('Room not found.');

    return GroqCompatibilityService.askQuestion(profile, room, question);
  }
}

module.exports = CompatibilityService;
