const prisma = require('../config/prisma');

class CompatibilityRepository {
  static async findCachedScore(tenantId, roomId) {
    return prisma.compatibilityScore.findFirst({
      where: { tenantId, roomId },
    });
  }

  static async saveScore(data) {
    return prisma.compatibilityScore.create({ data });
  }

  static async updateScore(id, data) {
    return prisma.compatibilityScore.update({
      where: { id },
      data,
    });
  }

  static async upsertScore(tenantId, roomId, score, explanation) {
    const existing = await this.findCachedScore(tenantId, roomId);
    if (existing) {
      // Prisma schema doesn't have updatedAt on CompatibilityScore, so we just update score and explanation
      return this.updateScore(existing.id, { score, explanation });
    }
    return this.saveScore({ tenantId, roomId, score, explanation });
  }

  static async findAllActiveRooms() {
    return prisma.room.findMany({
      where: { isFilled: false, deletedAt: null },
    });
  }

  static async findAllTenants() {
    return prisma.tenantProfile.findMany({
      where: { deletedAt: null },
    });
  }
}

module.exports = CompatibilityRepository;
