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
            room: { select: { title: true, ownerId: true, owner: { select: { name: true, avatarUrl: true } } } },
            tenant: { select: { id: true, name: true, avatarUrl: true } },
          },
        },
        messages: {
          orderBy: { createdAt: 'desc' },
          take: 1, // Get latest message for preview
        },
        _count: {
          select: {
            messages: {
              where: {
                senderId: { not: userId },
                status: { not: 'SEEN' }
              }
            }
          }
        }
      },
      orderBy: { createdAt: 'desc' },
    });
    
    // Map _count to unreadCount
    return chats.map(chat => {
      const { _count, ...rest } = chat;
      return {
        ...rest,
        unreadCount: _count?.messages || 0
      };
    });
  }

  static async createMessage(chatId, senderId, content) {
    return prisma.message.create({
      data: { chatId, senderId, message: content },
    });
  }

  static async findMessages(chatId, { cursor, limit = 50 }) {
    const query = {
      where: { chatId, deletedAt: null },
      orderBy: { createdAt: 'desc' }, // Newest first via Prisma
      take: parseInt(limit, 10),
      include: { sender: { select: { id: true, name: true } } },
    };

    if (cursor) {
      query.cursor = { id: cursor };
      query.skip = 1; // skip the cursor itself
    }

    const items = await prisma.message.findMany(query);
    
    let nextCursor = null;
    if (items.length === parseInt(limit, 10)) {
      nextCursor = items[items.length - 1].id;
    }
    
    // Get total items for metadata
    const totalItems = await prisma.message.count({ where: { chatId, deletedAt: null } });

    return { totalItems, items, nextCursor };
  }

  static async markMessagesAsRead(chatId, userId) {
    return prisma.message.updateMany({
      where: {
        chatId,
        senderId: { not: userId },
        status: { not: 'SEEN' }
      },
      data: { status: 'SEEN' }
    });
  }

  static async markMessagesAsDelivered(chatId, userId) {
    return prisma.message.updateMany({
      where: {
        chatId,
        senderId: { not: userId },
        status: 'SENT'
      },
      data: { status: 'DELIVERED' }
    });
  }
}

module.exports = ChatRepository;
