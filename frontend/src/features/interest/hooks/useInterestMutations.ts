import { useMutation, useQueryClient } from '@tanstack/react-query';
import { InterestService } from '../services/interest.service';
import { toast } from 'sonner';

export const useCreateInterest = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ roomId, tenantId, message }: { roomId: string, tenantId: string, message: string }) => 
      InterestService.create(roomId, tenantId, message),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tenant-requests'] });
      toast.success("Request sent successfully!");
    },
    onError: () => {
      toast.error("Failed to send request.");
    }
  });
};

export const useAcceptInterest = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (requestId: string) => InterestService.accept(requestId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['owner-requests'] });
      queryClient.invalidateQueries({ queryKey: ['chats'] });
      toast.success("Request accepted! Chat is now unlocked.", { position: 'top-center' });
    }
  });
};

export const useRejectInterest = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (requestId: string) => InterestService.reject(requestId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['owner-requests'] });
      toast.info("Request rejected.");
    }
  });
};

export const useCancelInterest = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (requestId: string) => InterestService.cancel(requestId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tenant-requests'] });
      toast.info("Request cancelled.");
    }
  });
};
