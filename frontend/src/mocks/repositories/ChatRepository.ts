import { mockChatThreads } from '../data/chatThreads';

let chats = [...mockChatThreads];

export const ChatRepository = {
  findAll: async () => [...chats],
  findById: async (id: string) => chats.find(c => c.id === id),
  findByParticipant: async (userId: string) => chats.filter(c => c.tenantId === userId || c.ownerId === userId),
  findByRequestId: async (requestId: string) => chats.find(c => c.requestId === requestId),
  save: async (chat: any) => {
    const idx = chats.findIndex(c => c.id === chat.id);
    if (idx >= 0) chats[idx] = chat;
    else chats.unshift(chat);
    return chat;
  }
};
