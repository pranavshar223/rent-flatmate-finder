const CompatibilityService = require('./compatibility.service');
const ApiResponse = require('../../shared/utils/ApiResponse');

class CompatibilityController {
  static async getRoomCompatibility(req, res) {
    const { roomId } = req.params;
    const tenantId = req.user.userId;

    const compatibility = await CompatibilityService.getRoomCompatibility(tenantId, roomId);

    if (!compatibility) {
      return ApiResponse.error(res, 404, 'NOT_FOUND', 'Could not generate compatibility score. Missing profile or room.');
    }

    return ApiResponse.success(res, 200, 'Compatibility retrieved successfully', compatibility);
  }

  static async getTenantCompatibilities(req, res) {
    const tenantId = req.user.userId;
    const compatibilities = await CompatibilityService.getTenantCompatibilities(tenantId);
    return ApiResponse.success(res, 200, 'Compatibilities retrieved successfully', compatibilities);
  }

  static async askQuestion(req, res) {
    const { roomId } = req.params;
    const { question } = req.body;
    const tenantId = req.user.userId;

    if (!question) {
      return ApiResponse.error(res, 400, 'BAD_REQUEST', 'Question is required.');
    }

    const answer = await CompatibilityService.askQuestion(tenantId, roomId, question);
    return ApiResponse.success(res, 200, 'Question answered successfully', { answer });
  }

  static async recalculate(req, res) {
    // Admin/internal endpoint trigger for manual recalculation
    const { tenantId, roomId } = req.body;
    
    if (tenantId) {
      CompatibilityService.recalculateForTenant(tenantId).catch(console.error);
    } else if (roomId) {
      CompatibilityService.recalculateForRoom(roomId).catch(console.error);
    }

    return ApiResponse.success(res, 202, 'Recalculation triggered successfully in the background');
  }
}

module.exports = CompatibilityController;
