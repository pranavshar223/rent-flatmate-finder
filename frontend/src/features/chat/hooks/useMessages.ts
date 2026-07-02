import { useInfiniteQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect, useCallback, useState } from 'react';
import { chatRepository } from '../../../repositories/ChatRepository';
import type { MessageDomain } from '../../../types/domain/chat';
import { useAuth } from '../../../contexts/AuthContext';
import { v4 as uuidv4 } from 'uuid';

export const MESSAGES_QUERY_KEY = (chatId: string) => ['chat', chatId, 'messages'];

export function useMessages(chatId: string | null) {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const [isOtherUserTyping, setIsOtherUserTyping] = useState(false);

  const query = useInfiniteQuery({
    queryKey: MESSAGES_QUERY_KEY(chatId!),
    queryFn: ({ pageParam }) => chatRepository.fetchMessages(chatId!, pageParam),
    initialPageParam: null as string | null,
    getNextPageParam: (lastPage) => lastPage.nextCursor || undefined,
    enabled: !!chatId,
  });

  useEffect(() => {
    if (!chatId) return;

    // Join room for specific chat events if needed by backend, though user room handles it mostly.
    chatRepository.joinChat(chatId);

    const unsubNewMessage = chatRepository.subscribe('message:new', (message: MessageDomain) => {
      if (message.chatId !== chatId) return;
      
      queryClient.setQueryData(MESSAGES_QUERY_KEY(chatId), (old: any) => {
        if (!old) return old;
        
        // If we already have this message (optimistic update), update its status
        let found = false;
        const newPages = old.pages.map((page: any) => {
          const items = page.items.map((item: MessageDomain) => {
            if (item.id === message.id || ((item as any).tempId && (item as any).tempId === (message as any).tempId)) {
              found = true;
              return message; // replace with real message
            }
            return item;
          });
          return { ...page, items };
        });

        if (found) {
          return { ...old, pages: newPages };
        }

        // Otherwise insert at the very beginning of the first page
        const firstPage = newPages[0];
        firstPage.items = [message, ...firstPage.items];
        return { ...old, pages: newPages };
      });
      
      // Auto mark as read if we are viewing the chat
      if (message.senderId !== user?.id) {
        chatRepository.markMessagesAsRead(chatId);
      }
    });

    const unsubDelivered = chatRepository.subscribe('message:delivered', (message: MessageDomain) => {
      if (message.chatId !== chatId) return;
      
      queryClient.setQueryData(MESSAGES_QUERY_KEY(chatId), (old: any) => {
        if (!old) return old;
        return {
          ...old,
          pages: old.pages.map((page: any) => ({
            ...page,
            items: page.items.map((item: MessageDomain) => 
              // Match by real id or temp id
              item.id === message.id || ((item as any).tempId && (item as any).tempId === (message as any).tempId)
                ? { ...item, status: 'DELIVERED', id: message.id }
                : item
            )
          }))
        };
      });
    });

    const unsubReadBatch = chatRepository.subscribe('message:read_batch', (data: { chatId: string, readBy: string }) => {
      if (data.chatId !== chatId) return;
      
      queryClient.setQueryData(MESSAGES_QUERY_KEY(chatId), (old: any) => {
        if (!old) return old;
        return {
          ...old,
          pages: old.pages.map((page: any) => ({
            ...page,
            items: page.items.map((item: MessageDomain) => {
              if (item.senderId !== data.readBy && item.status !== 'SEEN') {
                return { ...item, status: 'SEEN' };
              }
              return item;
            })
          }))
        };
      });
    });

    const unsubTyping = chatRepository.subscribe('chat:typing', (data: { userId: string, chatId: string }) => {
      if (data.chatId === chatId && data.userId !== user?.id) {
        setIsOtherUserTyping(true);
      }
    });

    const unsubStopTyping = chatRepository.subscribe('chat:stop_typing', (data: { userId: string, chatId: string }) => {
      if (data.chatId === chatId && data.userId !== user?.id) {
        setIsOtherUserTyping(false);
      }
    });

    return () => {
      chatRepository.leaveChat(chatId);
      unsubNewMessage();
      unsubDelivered();
      unsubReadBatch();
      unsubTyping();
      unsubStopTyping();
    };
  }, [chatId, queryClient, user?.id]);

  const sendMessage = useCallback((content: string) => {
    if (!chatId || !user) return;

    const tempId = uuidv4();
    const optimisticMessage: MessageDomain & { tempId: string } = {
      id: tempId,
      tempId,
      chatId,
      senderId: user.id,
      text: content,
      status: 'SENDING',
      createdAt: new Date(),
      senderName: user.name,
    };

    // Update UI immediately
    queryClient.setQueryData(MESSAGES_QUERY_KEY(chatId), (old: any) => {
      if (!old) return old;
      const pages = [...old.pages];
      if (pages.length > 0) {
        pages[0] = { ...pages[0], items: [optimisticMessage, ...pages[0].items] };
      }
      return { ...old, pages };
    });

    // Fire over socket
    chatRepository.sendMessage(chatId, content, tempId);
  }, [chatId, user, queryClient]);

  const sendTypingEvent = useCallback((isTyping: boolean) => {
    if (!chatId) return;
    if (isTyping) chatRepository.startTyping(chatId);
    else chatRepository.stopTyping(chatId);
  }, [chatId]);

  const markAsRead = useCallback(() => {
    if (!chatId) return;
    chatRepository.markMessagesAsRead(chatId);
  }, [chatId]);

  return {
    ...query,
    messages: query.data?.pages.flatMap((page) => page.items) ?? [],
    sendMessage,
    sendTypingEvent,
    markAsRead,
    isOtherUserTyping
  };
}
