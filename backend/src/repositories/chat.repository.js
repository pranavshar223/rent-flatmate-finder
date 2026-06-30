const prisma = require('../config/prisma');

class ChatRepository {
  static async createChat(interestRequestId) {
    return prisma.chat.create({
      data: { interestRequestId },
      include: { interestRequest: true },
    });
  }

  static async findChatByInterest(interestRequestId) {
    return prisma.chat.findUnique({
      where: { interestRequestId },
    });
  }

  static async findChatById(id) {
    return prisma.chat.findUnique({
      where: { id },
      include: {
        interestRequest: {
          include: { room: true },
        },
      },
    });
  }

  static async findUserChats(userId) {
    return prisma.chat.findMany({
      where: {
        interestRequest: {
          OR: [
            { tenantId: userId },
            { room: { ownerId: userId } },
          ],
        },
        deletedAt: null,
      },
      include: {
        interestRequest: {
          include: {
            room: { select: { title: true, ownerId: true } },
            tenant: { select: { id: true, name: true } },
          },
        },
        messages: {
          orderBy: { createdAt: 'desc' },
          take: 1, // Get latest message for preview
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  static async createMessage(chatId, senderId, content) {
    return prisma.message.create({
      data: { chatId, senderId, message: content },
    });
  }

  static async findMessages(chatId, pagination) {
    const { page, limit } = pagination;
    const totalItems = await prisma.message.count({ where: { chatId, deletedAt: null } });
    const items = await prisma.message.findMany({
      where: { chatId, deletedAt: null },
      orderBy: { createdAt: 'desc' }, // Newest first via Prisma
      skip: (page - 1) * limit,
      take: limit,
      include: { sender: { select: { id: true, name: true } } },
    });
    return { totalItems, items };
  }
}

module.exports = ChatRepository;
