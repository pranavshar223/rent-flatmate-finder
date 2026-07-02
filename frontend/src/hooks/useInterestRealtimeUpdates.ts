import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { InterestRepository } from '../repositories/InterestRepository';
import { queryKeys } from '../constants/queryKeys';

export const useInterestRealtimeUpdates = () => {
  const queryClient = useQueryClient();

  useEffect(() => {
    const handleEvent = (event: string) => {
      console.log(`[useInterestRealtimeUpdates] Invalidate query cache for event: ${event}`);
      
      // Invalidate relevant queries when an interest state changes
      queryClient.invalidateQueries({ queryKey: queryKeys.ownerRequests });
      queryClient.invalidateQueries({ queryKey: queryKeys.requests });

      // If a match is created, we also want to invalidate chats
      if (event === 'match:created') {
        queryClient.invalidateQueries({ queryKey: queryKeys.chats });
      }
      
      // On reconnect, aggressively invalidate everything related to interests to ensure sync
      if (event === 'socket:reconnected') {
        console.log(`[useInterestRealtimeUpdates] Reconnected. Aggressively syncing cache.`);
        queryClient.invalidateQueries({ queryKey: queryKeys.ownerRequests });
        queryClient.invalidateQueries({ queryKey: queryKeys.requests });
      }
    };

    const unsubscribe = InterestRepository.subscribeToUpdates(handleEvent);

    return () => {
      // Memory leak prevention: ensure we clean up the subscription on unmount
      unsubscribe();
    };
  }, [queryClient]);
};
