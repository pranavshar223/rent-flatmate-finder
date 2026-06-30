const AdminService = require('./admin.service');
const DashboardService = require('./dashboard.service');
const ApiResponse = require('../../shared/utils/ApiResponse');

class AdminController {
  static async getDashboardMetrics(req, res) {
    const metrics = await DashboardService.getMetrics(req.user.userId);
    return ApiResponse.success(res, 200, 'Dashboard metrics retrieved.', metrics);
  }

  static async getUsers(req, res) {
    const { page, limit } = req.query;
    const result = await AdminService.getUsers({ page, limit });
    return ApiResponse.success(res, 200, 'Users retrieved.', {
      currentPage: page,
      totalPages: Math.ceil(result.totalItems / limit),
      totalItems: result.totalItems,
      items: result.items,
    });
  }

  static async deleteUser(req, res) {
    await AdminService.deleteUser(req.user.userId, req.params.id);
    return ApiResponse.success(res, 200, 'User successfully soft deleted.');
  }

  static async getRooms(req, res) {
    const { page, limit } = req.query;
    const result = await AdminService.getRooms({ page, limit });
    return ApiResponse.success(res, 200, 'Rooms retrieved.', {
      currentPage: page,
      totalPages: Math.ceil(result.totalItems / limit),
      totalItems: result.totalItems,
      items: result.items,
    });
  }

  static async deleteRoom(req, res) {
    await AdminService.deleteRoom(req.user.userId, req.params.id);
    return ApiResponse.success(res, 200, 'Room successfully soft deleted.');
  }
}

module.exports = AdminController;
