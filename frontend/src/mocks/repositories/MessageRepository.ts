import { mockMessages } from '../data/messages';

let messages = [...mockMessages];

export const MessageRepository = {
  findByChatId: async (chatId: string) => messages.filter(m => m.chatId === chatId).sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()),
  save: async (message: any) => {
    const idx = messages.findIndex(m => m.id === message.id);
    if (idx >= 0) messages[idx] = message;
    else messages.push(message);
    return message;
  },
  updateStatus: async (messageId: string, status: string) => {
    const msg = messages.find(m => m.id === messageId);
    if (msg) msg.status = status;
    return msg;
  }
};
