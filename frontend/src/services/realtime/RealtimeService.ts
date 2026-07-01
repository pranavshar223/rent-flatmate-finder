import { EVENTS } from '../../constants/events';
import { ChatRepository } from '../../mocks/repositories/ChatRepository';
import { MessageRepository } from '../../mocks/repositories/MessageRepository';

type EventCallback = (payload: any) => void;

class RealtimeService {
  private listeners: Record<string, EventCallback[]> = {};

  // Attach event listener
  on(event: string, callback: EventCallback) {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    this.listeners[event].push(callback);
  }

  // Remove event listener
  off(event: string, callback: EventCallback) {
    if (!this.listeners[event]) return;
    this.listeners[event] = this.listeners[event].filter(cb => cb !== callback);
  }

  // Emit event (Simulating server-to-client)
  emit(event: string, payload: any) {
    if (this.listeners[event]) {
      this.listeners[event].forEach(cb => cb(payload));
    }
  }

  // Simulating sending a message to server
  async sendMessage(chatId: string, senderId: string, content: string) {
    const newMessage = {
      id: `msg_${Date.now()}`,
      chatId,
      senderId,
      content,
      timestamp: new Date().toISOString(),
      status: 'sending'
    };

    // Immediate optimistic emission to local UI
    this.emit(EVENTS.MESSAGE_SENT, newMessage);

    // Simulate network delay for "sent"
    setTimeout(async () => {
      newMessage.status = 'sent';
      await MessageRepository.save(newMessage);
      
      const chat = await ChatRepository.findById(chatId);
      if (chat) {
        chat.lastMessage = content;
        chat.updatedAt = new Date().toISOString();
        if (senderId === 'tenant1') chat.unreadCountOwner += 1;
        else chat.unreadCountTenant += 1;
        await ChatRepository.save(chat);
      }

      this.emit(EVENTS.MESSAGE_SENT, { ...newMessage });

      // Simulate delivery after a brief moment
      setTimeout(async () => {
        newMessage.status = 'delivered';
        await MessageRepository.save(newMessage);
        this.emit(EVENTS.MESSAGE_SENT, { ...newMessage });
        
        // Mock a reply if it's tenant sending
        if (senderId === 'tenant1') {
          setTimeout(async () => {
            // "read" receipt
            newMessage.status = 'read';
            await MessageRepository.save(newMessage);
            this.emit(EVENTS.MESSAGE_SENT, { ...newMessage });
            
            // Send Mock Reply
            const replyMessage = {
              id: `msg_${Date.now() + 1}`,
              chatId,
              senderId: chat?.ownerId || 'owner1',
              content: `Thanks for your message! This is an automated mock reply.`,
              timestamp: new Date().toISOString(),
              status: 'sent'
            };
            await MessageRepository.save(replyMessage);
            if (chat) {
              chat.lastMessage = replyMessage.content;
              chat.unreadCountTenant += 1;
              await ChatRepository.save(chat);
            }
            this.emit(EVENTS.MESSAGE_RECEIVED, replyMessage);
          }, 2000);
        }
      }, 800);

    }, 500);

    return newMessage;
  }
}

export const realtimeService = new RealtimeService();
