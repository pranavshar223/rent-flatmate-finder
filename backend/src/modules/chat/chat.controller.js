const ChatService = require('./chat.service');
const ApiResponse = require('../../shared/utils/ApiResponse');

class ChatController {
  static async getUserChats(req, res) {
    const chats = await ChatService.getUserChats(req.user.userId);
    return ApiResponse.success(res, 200, 'Chats retrieved.', chats);
  }

  static async getChatDetails(req, res) {
    const chat = await ChatService.getChatDetails(req.params.id, req.user.userId);
    return ApiResponse.success(res, 200, 'Chat retrieved.', chat);
  }

  static async getChatMessages(req, res) {
    const { cursor, limit } = req.query;
    const result = await ChatService.getChatMessages(req.params.id, req.user.userId, { cursor, limit });
    return ApiResponse.success(res, 200, 'Messages retrieved.', {
      nextCursor: result.nextCursor,
      totalItems: result.totalItems,
      items: result.items,
    });
  }
}

module.exports = ChatController;
