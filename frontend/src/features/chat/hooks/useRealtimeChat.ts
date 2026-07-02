import { useEffect, useState } from 'react';
import { chatRepository } from '../../../repositories/ChatRepository';

export function useRealtimeChat() {
  const [onlineUsers, setOnlineUsers] = useState<Map<string, Date>>(new Map());

  useEffect(() => {
    const unsubOnline = chatRepository.subscribe('chat:online', ({ userId, timestamp }) => {
      setOnlineUsers(prev => {
        const next = new Map(prev);
        next.set(userId, new Date(timestamp));
        return next;
      });
    });

    const unsubOffline = chatRepository.subscribe('chat:offline', ({ userId }) => {
      setOnlineUsers(prev => {
        const next = new Map(prev);
        next.delete(userId);
        return next;
      });
    });

    return () => {
      unsubOnline();
      unsubOffline();
    };
  }, []);

  const isUserOnline = (userId: string) => onlineUsers.has(userId);

  return {
    isUserOnline,
  };
}
