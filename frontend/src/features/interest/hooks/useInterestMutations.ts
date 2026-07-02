import { useMutation, useQueryClient } from '@tanstack/react-query';
import { InterestRepository } from '../../../repositories/InterestRepository';
import { queryKeys } from '../../../constants/queryKeys';
import { toast } from 'sonner';

export const useCreateInterest = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ roomId, message }: { roomId: string, tenantId?: string, message: string }) => 
      InterestRepository.createInterest(roomId, message),
    onMutate: async (newInterest) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.requests });
      const previousRequests = queryClient.getQueryData(queryKeys.requests);
      
      // Optimistically add the new request with a temporary ID and status 'PENDING'
      queryClient.setQueryData(queryKeys.requests, (old: any) => {
        if (!old) return old;
        const fakeReq = {
          id: `temp_${Date.now()}`,
          roomId: newInterest.roomId,
          status: 'PENDING',
          message: newInterest.message,
          createdAt: new Date().toISOString()
        };
        return {
          ...old,
          items: [fakeReq, ...(old.items || [])]
        };
      });
      return { previousRequests };
    },
    onError: (_err, _newInterest, context: any) => {
      if (context?.previousRequests) {
        queryClient.setQueryData(queryKeys.requests, context.previousRequests);
      }
      toast.error("Failed to send request.");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.requests });
      queryClient.invalidateQueries({ queryKey: queryKeys.rooms }); // Invalidate rooms in case UI depends on request state
    },
    onSuccess: () => {
      toast.success("Request sent successfully!");
    }
  });
};

export const useAcceptInterest = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (requestId: string) => InterestRepository.acceptRequest(requestId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.ownerRequests });
      queryClient.invalidateQueries({ queryKey: ['chats'] });
      toast.success("Request accepted! Chat is now unlocked.", { position: 'top-center' });
    }
  });
};

export const useRejectInterest = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (requestId: string) => InterestRepository.rejectRequest(requestId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.ownerRequests });
      toast.info("Request rejected.");
    }
  });
};

export const useCancelInterest = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (requestId: string) => InterestRepository.cancelRequest(requestId),
    onMutate: async (requestId) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.requests });
      const previousRequests = queryClient.getQueryData(queryKeys.requests);

      // Optimistically remove the request
      queryClient.setQueryData(queryKeys.requests, (old: any) => {
        if (!old) return old;
        return {
          ...old,
          items: old.items.filter((req: any) => req.id !== requestId)
        };
      });

      return { previousRequests };
    },
    onError: (_err, _requestId, context: any) => {
      if (context?.previousRequests) {
        queryClient.setQueryData(queryKeys.requests, context.previousRequests);
      }
      toast.error("Failed to cancel request.");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.requests });
    },
    onSuccess: () => {
      toast.info("Request cancelled.");
    }
  });
};
