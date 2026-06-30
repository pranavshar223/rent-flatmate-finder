const AnalyticsRepository = require('../../repositories/analytics.repository');
const prisma = require('../../config/prisma');
const { NotFoundError, ValidationError, AuthorizationError } = require('../../shared/errors');

class AdminService {
  
  static async getUsers(pagination) {
    return AnalyticsRepository.getUsers(pagination);
  }

  static async deleteUser(adminId, targetUserId) {
    if (adminId === targetUserId) {
      throw new ValidationError('Admin cannot delete themselves.');
    }

    const user = await prisma.user.findUnique({ where: { id: targetUserId } });
    if (!user) throw new NotFoundError('User not found.');

    await prisma.user.update({
      where: { id: targetUserId },
      data: { deletedAt: new Date() }
    });

    await AnalyticsRepository.logAdminAction(adminId, 'DELETE_USER', 'USER', targetUserId, { email: user.email });
    console.info(`[ADMIN] User ${targetUserId} deleted by Admin ${adminId}`);
    return true;
  }

  static async getRooms(pagination) {
    return AnalyticsRepository.getRooms(pagination);
  }

  static async deleteRoom(adminId, roomId) {
    const room = await prisma.room.findUnique({ where: { id: roomId } });
    if (!room) throw new NotFoundError('Room not found.');

    await prisma.room.update({
      where: { id: roomId },
      data: { deletedAt: new Date() }
    });

    await AnalyticsRepository.logAdminAction(adminId, 'DELETE_ROOM', 'ROOM', roomId, { title: room.title });
    console.info(`[ADMIN] Room ${roomId} deleted by Admin ${adminId}`);
    return true;
  }
}

module.exports = AdminService;
