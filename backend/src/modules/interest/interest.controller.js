const InterestService = require('./interest.service');
const ApiResponse = require('../../shared/utils/ApiResponse');

class InterestController {
  static async createInterest(req, res) {
    const { roomId } = req.body;
    const request = await InterestService.createInterest(req.user.userId, roomId);
    return ApiResponse.success(res, 201, 'Interest request sent successfully.', request);
  }

  static async getTenantRequests(req, res) {
    const { status } = req.query;
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    
    const result = await InterestService.getTenantRequests(req.user.userId, { status }, { page, limit });
    return ApiResponse.success(res, 200, 'Requests retrieved.', {
      currentPage: page,
      totalPages: Math.ceil(result.totalItems / limit),
      totalItems: result.totalItems,
      items: result.items,
    });
  }

  static async getOwnerRequests(req, res) {
    const { status } = req.query;
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    
    const result = await InterestService.getOwnerRequests(req.user.userId, { status }, { page, limit });
    return ApiResponse.success(res, 200, 'Requests retrieved.', {
      currentPage: page,
      totalPages: Math.ceil(result.totalItems / limit),
      totalItems: result.totalItems,
      items: result.items,
    });
  }

  static async getRequestById(req, res) {
    const request = await InterestService.getRequestById(req.params.id, req.user.userId, req.user.role);
    return ApiResponse.success(res, 200, 'Request details retrieved.', request);
  }

  static async acceptRequest(req, res) {
    const request = await InterestService.acceptRequest(req.params.id, req.user.userId);
    return ApiResponse.success(res, 200, 'Request accepted successfully.', request);
  }

  static async rejectRequest(req, res) {
    const request = await InterestService.rejectRequest(req.params.id, req.user.userId);
    return ApiResponse.success(res, 200, 'Request rejected.', request);
  }

  static async cancelRequest(req, res) {
    await InterestService.cancelRequest(req.params.id, req.user.userId);
    return ApiResponse.success(res, 200, 'Request cancelled.');
  }
}

module.exports = InterestController;
