const prisma = require('../config/prisma');

class TenantRepository {
  static async createProfile(profileData) {
    return prisma.tenantProfile.create({
      data: profileData,
    });
  }

  static async findProfileByUserId(userId) {
    return prisma.tenantProfile.findUnique({
      where: { userId },
    });
  }

  static async updateProfile(userId, updateData) {
    return prisma.tenantProfile.update({
      where: { userId },
      data: updateData,
    });
  }

  static async deleteProfile(userId) {
    return prisma.tenantProfile.delete({
      where: { userId },
    });
  }

  static async findAvailableRooms(filters, pagination, sorting) {
    const { location, minBudget, maxBudget, roomType, furnishing, excludeOwnerId } = filters;
    const { page, limit } = pagination;
    const { sort } = sorting;

    const where = {
      isFilled: false,
      deletedAt: null, // Exclude soft-deleted items (if applicable in future)
      ownerId: { not: excludeOwnerId },
    };

    if (location) {
      where.location = { contains: location, mode: 'insensitive' };
    }
    if (minBudget !== undefined) {
      where.rent = { ...where.rent, gte: minBudget };
    }
    if (maxBudget !== undefined) {
      where.rent = { ...where.rent, lte: maxBudget };
    }
    if (roomType) {
      where.roomType = roomType;
    }
    if (furnishing) {
      where.furnishingStatus = furnishing;
    }

    let orderBy = {};
    if (sort === 'newest') orderBy = { createdAt: 'desc' };
    else if (sort === 'rent_asc') orderBy = { rent: 'asc' };
    else if (sort === 'rent_desc') orderBy = { rent: 'desc' };

    const totalItems = await prisma.room.count({ where });

    const items = await prisma.room.findMany({
      where,
      orderBy,
      skip: (page - 1) * limit,
      take: limit,
      include: { images: true },
    });

    return { totalItems, items };
  }
}

module.exports = TenantRepository;
