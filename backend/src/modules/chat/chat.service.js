const ChatRepository = require('../../repositories/chat.repository');
const { EVENTS } = require('../../shared/events/events.constants');
const eventEmitter = require('../../shared/events/eventEmitter');
const { NotFoundError, AuthorizationError, ValidationError } = require('../../shared/errors');

class ChatService {
  static async createChatFromInterest(interestId) {
    const existingChat = await ChatRepository.findChatByInterest(interestId);
    if (existingChat) return existingChat;

    const chat = await ChatRepository.createChat(interestId);
    console.info(`[INFO] Chat Created: ID ${chat.id} from Interest ${interestId}`);
    
    eventEmitter.emit(EVENTS.CHAT_CREATED, { chatId: chat.id, interestId, timestamp: new Date().toISOString() });
    return chat;
  }

  static async getUserChats(userId) {
    return ChatRepository.findUserChats(userId);
  }

  static async getChatDetails(chatId, userId) {
    const chat = await ChatRepository.findChatById(chatId);
    if (!chat || chat.deletedAt) throw new NotFoundError('Chat not found.');

    const isTenant = chat.interestRequest.tenantId === userId;
    const isOwner = chat.interestRequest.room.ownerId === userId;
    if (!isTenant && !isOwner) {
      throw new AuthorizationError('You are not authorized to view this chat.');
    }

    return chat;
  }

  static async getChatMessages(chatId, userId, pagination) {
    // Authorize participant
    await this.getChatDetails(chatId, userId);
    return ChatRepository.findMessages(chatId, pagination);
  }
  
  static async saveMessage(chatId, senderId, content) {
    if (!content || content.trim().length === 0) {
      throw new ValidationError('Message content cannot be empty.');
    }
    
    // Verify participant authorization again
    const chat = await ChatRepository.findChatById(chatId);
    if (!chat || chat.deletedAt) throw new NotFoundError('Chat not found.');

    const isTenant = chat.interestRequest.tenantId === senderId;
    const isOwner = chat.interestRequest.room.ownerId === senderId;
    if (!isTenant && !isOwner) {
      throw new AuthorizationError('You are not a participant of this chat.');
    }

    const savedMsg = await ChatRepository.createMessage(chatId, senderId, content);
    console.info(`[INFO] Message Saved: Chat ${chatId} | Sender ${senderId}`);
    return savedMsg;
  }
}

module.exports = ChatService;
