const prisma = require('../config/prisma');

class UserRepository {
  static async findById(id) {
    return prisma.user.findUnique({
      where: { id },
    });
  }

  static async findByEmail(email) {
    return prisma.user.findUnique({
      where: { email },
    });
  }

  static async create(userData) {
    return prisma.user.create({
      data: userData,
    });
  }

  static async update(id, updateData) {
    return prisma.user.update({
      where: { id },
      data: updateData,
    });
  }

  static async updateLastSeen(id) {
    return prisma.user.update({
      where: { id },
      data: { lastSeenAt: new Date() },
    });
  }
}

module.exports = UserRepository;
