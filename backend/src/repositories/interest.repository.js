const prisma = require('../config/prisma');

class InterestRepository {
  static async createInterest(data) {
    return prisma.interestRequest.create({
      data,
      include: { room: true },
    });
  }

  static async findById(id) {
    return prisma.interestRequest.findUnique({
      where: { id },
      include: { room: true },
    });
  }

  static async existsPendingRequest(tenantId, roomId) {
    const existing = await prisma.interestRequest.findFirst({
      where: {
        tenantId,
        roomId,
        status: 'PENDING',
        deletedAt: null,
      },
    });
    return !!existing;
  }

  static async findTenantRequests(tenantId, filters, pagination) {
    const { status } = filters;
    const { page, limit } = pagination;
    
    const where = { tenantId, deletedAt: null };
    if (status) where.status = status;

    const totalItems = await prisma.interestRequest.count({ where });
    const items = await prisma.interestRequest.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
      include: { room: true },
    });
    
    return { totalItems, items };
  }

  static async findOwnerRequests(ownerId, filters, pagination) {
    const { status } = filters;
    const { page, limit } = pagination;

    const where = {
      room: { ownerId },
      deletedAt: null,
    };
    if (status) where.status = status;

    const totalItems = await prisma.interestRequest.count({ where });
    const items = await prisma.interestRequest.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
      include: { room: true, tenant: { select: { id: true, name: true, email: true, phone: true } } },
    });

    return { totalItems, items };
  }

  static async updateStatus(id, status, tx = prisma) {
    return tx.interestRequest.update({
      where: { id },
      data: { status },
      include: { room: true },
    });
  }

  static async softDeleteInterest(id) {
    return prisma.interestRequest.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }
}

module.exports = InterestRepository;
