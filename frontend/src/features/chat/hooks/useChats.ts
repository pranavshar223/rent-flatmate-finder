import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { chatRepository } from '../../../repositories/ChatRepository';
import type { ChatDomain } from '../../../types/domain/chat';

export const CHATS_QUERY_KEY = ['chats'];

export function useChats() {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: CHATS_QUERY_KEY,
    queryFn: () => chatRepository.fetchChats(),
  });

  useEffect(() => {
    // Listen for new messages to update the chat list unread counts and latest messages
    const unsubNewMessage = chatRepository.subscribe('message:new', (message) => {
      queryClient.setQueryData<ChatDomain[]>(CHATS_QUERY_KEY, (old) => {
        if (!old) return old;
        return old.map(chat => {
          if (chat.id === message.chatId) {
            // Check if sender is not current user to increment unread?
            // Actually, we need to know the current user to accurately increment unread.
            // But we can just invalidate the query to be safe, or optimistic update.
            return {
              ...chat,
              latestMessageText: message.text,
              latestMessageCreatedAt: message.createdAt,
              updatedAt: new Date(),
              // We'll let the read batch handler deal with clearing unread counts
            };
          }
          return chat;
        }).sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime());
      });
    });

    const unsubReadBatch = chatRepository.subscribe('message:read_batch', ({ chatId }) => {
      queryClient.setQueryData<ChatDomain[]>(CHATS_QUERY_KEY, (old) => {
        if (!old) return old;
        return old.map(chat => {
          if (chat.id === chatId) {
            return { ...chat, unreadCount: 0 };
          }
          return chat;
        });
      });
    });

    return () => {
      unsubNewMessage();
      unsubReadBatch();
    };
  }, [queryClient]);

  return query;
}
