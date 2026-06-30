const TenantRepository = require('../../repositories/tenant.repository');
const { NotFoundError, ConflictError, ValidationError } = require('../../shared/errors');
const eventEmitter = require('../../shared/events/eventEmitter');
const { EVENTS } = require('../../shared/events/events.constants');

class TenantService {
  static async createProfile(userId, profileData) {
    const existingProfile = await TenantRepository.findProfileByUserId(userId);
    if (existingProfile) {
      throw new ConflictError('Tenant profile already exists. Use the update endpoint.');
    }

    const newProfile = await TenantRepository.createProfile({
      ...profileData,
      userId,
      moveInDate: new Date(profileData.moveInDate),
    });

    console.info(`[INFO] Profile Created: Tenant ${userId} at ${new Date().toISOString()}`);
    eventEmitter.emit(EVENTS.TENANT_PROFILE_CREATED, { userId, timestamp: new Date().toISOString() });
    return newProfile;
  }

  static async getProfile(userId) {
    const profile = await TenantRepository.findProfileByUserId(userId);
    if (!profile) {
      throw new NotFoundError('Tenant profile not found.');
    }
    return profile;
  }

  static async updateProfile(userId, updateData) {
    const existingProfile = await TenantRepository.findProfileByUserId(userId);
    if (!existingProfile) {
      throw new NotFoundError('Tenant profile not found. Please create one first.');
    }

    // Validate min/max budget cross-dependency if only one field is updated
    let finalMin = updateData.minBudget !== undefined ? updateData.minBudget : Number(existingProfile.minBudget);
    let finalMax = updateData.maxBudget !== undefined ? updateData.maxBudget : Number(existingProfile.maxBudget);
    if (finalMax < finalMin) {
      throw new ValidationError('Max budget must be greater than or equal to min budget.');
    }

    if (updateData.moveInDate) {
      updateData.moveInDate = new Date(updateData.moveInDate);
    }

    const updatedProfile = await TenantRepository.updateProfile(userId, updateData);
    console.info(`[INFO] Profile Updated: Tenant ${userId} at ${new Date().toISOString()}`);
    eventEmitter.emit(EVENTS.TENANT_PROFILE_UPDATED, { userId, timestamp: new Date().toISOString() });
    return updatedProfile;
  }

  static async getAvailableRooms(userId, filters, queryParams) {
    const { page, limit, sort } = queryParams;

    const { totalItems, items } = await TenantRepository.findAvailableRooms(
      { ...filters, excludeOwnerId: userId },
      { page, limit },
      { sort }
    );

    console.info(`[INFO] Rooms Browsed: Tenant ${userId} at ${new Date().toISOString()}`);

    return {
      currentPage: page,
      totalPages: Math.ceil(totalItems / limit),
      totalItems,
      items,
    };
  }
}

module.exports = TenantService;
