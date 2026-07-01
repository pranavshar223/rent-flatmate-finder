import { ChatRepository } from '../../../mocks/repositories/ChatRepository';
import { MessageRepository } from '../../../mocks/repositories/MessageRepository';
import { realtimeService } from '../../../services/realtime/RealtimeService';

export const ChatService = {
  getChatsForUser: async (userId: string) => {
    await new Promise(r => setTimeout(r, 400));
    return await ChatRepository.findByParticipant(userId);
  },

  getMessages: async (chatId: string) => {
    await new Promise(r => setTimeout(r, 400));
    return await MessageRepository.findByChatId(chatId);
  },

  sendMessage: async (chatId: string, senderId: string, content: string) => {
    // We delegate the send to RealtimeService so it can simulate network & socket delays
    return await realtimeService.sendMessage(chatId, senderId, content);
  }
};
