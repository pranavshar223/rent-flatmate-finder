import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { InterestRepository } from '../../../repositories/InterestRepository';
import { queryKeys } from '../../../constants/queryKeys';
import { toast } from 'sonner';

export const useInterestRealtimeUpdates = () => {
  const queryClient = useQueryClient();

  useEffect(() => {
    // Subscribe to real-time events from the Repository
    const unsubscribe = InterestRepository.subscribeToUpdates((event) => {
      
      // Invalidate relevant queries to trigger a refetch
      if (
        event === 'interest:created' || 
        event === 'interest:accepted' || 
        event === 'interest:rejected' || 
        event === 'interest:cancelled'
      ) {
        // Invalidate both tenant and owner requests lists to be safe,
        // or we could be more specific based on the payload.
        queryClient.invalidateQueries({ queryKey: queryKeys.requests });
        queryClient.invalidateQueries({ queryKey: queryKeys.ownerRequests });
      }

      if (event === 'match:created') {
        queryClient.invalidateQueries({ queryKey: ['chats'] });
        toast.success("A new chat has been started!", { position: 'top-center' });
      }

      // Optionally show a toast for specific events if needed
      // (Usually the person making the action gets a local toast from the mutation, 
      // but if an owner accepts our request while we are online, we might want a toast)
    });

    // Cleanup subscription on unmount
    return () => {
      unsubscribe();
    };
  }, [queryClient]);
};
