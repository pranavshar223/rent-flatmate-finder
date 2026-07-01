import { useEffect } from 'react';
import { realtimeService } from './RealtimeService';
import { EVENTS } from '../../constants/events';
import { toast } from 'sonner';

export const RealtimeProvider = ({ children }: { children: React.ReactNode }) => {
  useEffect(() => {
    const handleNewMessage = (payload: any) => {
      // Don't toast if we're on the chat page for this exact chat, but for now we'll just toast simply
      toast.info(`New message from ${payload.senderId === 'owner2' ? 'Owner' : 'Tenant'}`, {
        description: payload.content,
      });
    };

    realtimeService.on(EVENTS.MESSAGE_RECEIVED, handleNewMessage);

    return () => {
      realtimeService.off(EVENTS.MESSAGE_RECEIVED, handleNewMessage);
    };
  }, []);

  return <>{children}</>;
};
