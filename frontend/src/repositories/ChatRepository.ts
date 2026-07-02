import { chatApi } from '../api/chat.api';
import { socketManager } from '../services/socket/SocketManager';
import type { ChatDomain } from '../types/domain/chat';
import { mapChatToDomain, mapMessageToDomain } from '../mappers/chat.mapper';

type EventHandler = (data: any) => void;

class ChatRepository {
  private listeners: Map<string, Set<EventHandler>> = new Map();
  private socketInitialized = false;

  constructor() {
    this.initSocketListeners();
  }

  private initSocketListeners() {
    if (this.socketInitialized) return;

    socketManager.on('chat:message', (data) => {
      this.publish('message:new', mapMessageToDomain(data));
    });

    socketManager.on('chat:delivered', (data) => {
      this.publish('message:delivered', mapMessageToDomain(data));
    });

    socketManager.on('chat:read', (data) => {
      this.publish('message:read_batch', data); // { chatId, readBy, timestamp }
    });

    socketManager.on('chat:typing', (data) => {
      this.publish('chat:typing', data);
    });

    socketManager.on('chat:stop_typing', (data) => {
      this.publish('chat:stop_typing', data);
    });

    socketManager.on('chat:online', (data) => {
      this.publish('chat:online', data); // { userId, timestamp }
    });

    socketManager.on('chat:offline', (data) => {
      this.publish('chat:offline', data); // { userId, lastSeenAt }
    });

    this.socketInitialized = true;
  }

  // Pub/Sub
  subscribe(event: string, handler: EventHandler): () => void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event)!.add(handler);

    return () => {
      const handlers = this.listeners.get(event);
      if (handlers) {
        handlers.delete(handler);
        if (handlers.size === 0) {
          this.listeners.delete(event);
        }
      }
    };
  }

  private publish(event: string, data: any) {
    const handlers = this.listeners.get(event);
    if (handlers) {
      handlers.forEach((handler) => handler(data));
    }
  }

  // REST API Methods
  async fetchChats(): Promise<ChatDomain[]> {
    const response = await chatApi.getConversations();
    return response.data.map(mapChatToDomain);
  }

  async fetchMessages(chatId: string, cursor?: string | null, limit: number = 50) {
    // We need to update chatApi to support cursor pagination, but for now we'll pass cursor
    const response = await chatApi.getChatMessages(chatId, cursor, limit);
    return {
      nextCursor: response.data.nextCursor,
      totalItems: response.data.totalItems,
      items: response.data.items.map(mapMessageToDomain),
    };
  }

  // Socket actions
  joinChat(chatId: string) {
    socketManager.emit('chat:join', { chatId });
  }

  leaveChat(chatId: string) {
    socketManager.emit('chat:leave', { chatId });
  }

  sendMessage(chatId: string, content: string, tempId: string) {
    // Send message via socket
    // Returning tempId allows optimistic UI mapping
    socketManager.emit('chat:message', { chatId, content, tempId });
  }

  startTyping(chatId: string) {
    socketManager.emit('typing:start', { chatId });
  }

  stopTyping(chatId: string) {
    socketManager.emit('typing:stop', { chatId });
  }

  markMessagesAsRead(chatId: string) {
    socketManager.emit('message:read', { chatId });
  }
}

export const chatRepository = new ChatRepository();
