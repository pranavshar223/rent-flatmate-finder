const TenantService = require('./tenant.service');
const ApiResponse = require('../../shared/utils/ApiResponse');

class TenantController {
  static async createProfile(req, res) {
    const profile = await TenantService.createProfile(req.user.userId, req.body);
    return ApiResponse.success(res, 201, 'Profile created successfully', profile);
  }

  static async getProfile(req, res) {
    const profile = await TenantService.getProfile(req.user.userId);
    return ApiResponse.success(res, 200, 'Profile retrieved successfully', profile);
  }

  static async updateProfile(req, res) {
    const profile = await TenantService.updateProfile(req.user.userId, req.body);
    return ApiResponse.success(res, 200, 'Profile updated successfully', profile);
  }

  static async browseRooms(req, res) {
    const { page, limit, sort, ...filters } = req.query;
    
    const result = await TenantService.getAvailableRooms(
      req.user.userId, 
      filters, 
      { page, limit, sort }
    );

    return ApiResponse.success(res, 200, 'Rooms retrieved successfully', result);
  }
}

module.exports = TenantController;
