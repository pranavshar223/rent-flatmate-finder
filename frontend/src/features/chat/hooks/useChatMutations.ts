import { useMutation } from '@tanstack/react-query';
import { ChatService } from '../services/chat.service';

export const useSendMessage = () => {
  return useMutation({
    mutationFn: ({ chatId, senderId, content }: { chatId: string, senderId: string, content: string }) => 
      ChatService.sendMessage(chatId, senderId, content),
    onSuccess: () => {
      // Optimistically we already updated local state via realtime service events,
      // but if we needed to invalidate, we'd do:
      // queryClient.invalidateQueries({ queryKey: ['messages', variables.chatId] });
    }
  });
};
