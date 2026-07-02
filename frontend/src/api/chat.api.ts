import { axiosInstance as api } from './axios';
import type { ChatListResponse, ChatMessageListResponse, ChatDetailsResponse } from '../types/api/chat.dto';

export const chatApi = {
  getConversations: async () => {
    const response = await api.get<ChatListResponse>('/chat');
    return response.data;
  },
  
  getChatDetails: async (chatId: string) => {
    const response = await api.get<ChatDetailsResponse>(`/chat/${chatId}`);
    return response.data;
  },

  getChatMessages: async (chatId: string, cursor?: string | null, limit: number = 50): Promise<ChatMessageListResponse> => {
    let url = `/chat/${chatId}/messages?limit=${limit}`;
    if (cursor) {
      url += `&cursor=${cursor}`;
    }
    const response = await api.get(url);
    return response.data;
  },
};
