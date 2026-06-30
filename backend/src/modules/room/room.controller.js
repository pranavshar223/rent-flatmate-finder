const RoomService = require('./room.service');
const ApiResponse = require('../../shared/utils/ApiResponse');

class RoomController {
  static async createRoom(req, res) {
    const room = await RoomService.createRoom(req.user.userId, req.body, req.files);
    return ApiResponse.success(res, 201, 'Room created successfully', room);
  }

  static async getOwnerRooms(req, res) {
    const rooms = await RoomService.getOwnerRooms(req.user.userId);
    return ApiResponse.success(res, 200, 'Rooms retrieved successfully', rooms);
  }

  static async getRoomById(req, res) {
    const room = await RoomService.getRoomById(req.params.id);
    return ApiResponse.success(res, 200, 'Room details retrieved', room);
  }

  static async updateRoom(req, res) {
    const room = await RoomService.updateRoom(req.params.id, req.user.userId, req.body);
    return ApiResponse.success(res, 200, 'Room updated successfully', room);
  }

  static async markAsFilled(req, res) {
    const room = await RoomService.markAsFilled(req.params.id, req.user.userId);
    return ApiResponse.success(res, 200, 'Room marked as filled', room);
  }

  static async deleteRoom(req, res) {
    await RoomService.deleteRoom(req.params.id, req.user.userId);
    return ApiResponse.success(res, 200, 'Room deleted successfully');
  }
}

module.exports = RoomController;
