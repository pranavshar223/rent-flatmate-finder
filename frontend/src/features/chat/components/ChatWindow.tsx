import { useEffect, useRef, useState } from 'react';
import { MessageBubble } from './MessageBubble';
import { useSendMessage } from '../hooks/useChatMutations';
import { useQuery } from '@tanstack/react-query';
import { ChatService } from '../services/chat.service';
import { realtimeService } from '../../../services/realtime/RealtimeService';
import { EVENTS } from '../../../constants/events';

interface ChatWindowProps {
  chatId: string;
  currentUserId: string;
  recipientName: string;
}

export const ChatWindow = ({ chatId, currentUserId, recipientName }: ChatWindowProps) => {
  const { data: initialMessages = [], isLoading } = useQuery({
    queryKey: ['messages', chatId],
    queryFn: () => ChatService.getMessages(chatId)
  });

  const [messages, setMessages] = useState<any[]>([]);
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const sendMessageMutation = useSendMessage();

  useEffect(() => {
    if (initialMessages.length > 0) {
      setMessages(initialMessages);
    }
  }, [initialMessages]);

  useEffect(() => {
    const handleMessageUpdate = (payload: any) => {
      if (payload.chatId === chatId) {
        setMessages(prev => {
          const idx = prev.findIndex(m => m.id === payload.id);
          if (idx >= 0) {
            const next = [...prev];
            next[idx] = payload;
            return next;
          }
          return [...prev, payload];
        });
      }
    };

    realtimeService.on(EVENTS.MESSAGE_SENT, handleMessageUpdate);
    realtimeService.on(EVENTS.MESSAGE_RECEIVED, handleMessageUpdate);

    return () => {
      realtimeService.off(EVENTS.MESSAGE_SENT, handleMessageUpdate);
      realtimeService.off(EVENTS.MESSAGE_RECEIVED, handleMessageUpdate);
    };
  }, [chatId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;
    sendMessageMutation.mutate({ chatId, senderId: currentUserId, content: inputValue });
    setInputValue('');
  };

  if (isLoading) return <div className="flex-1 flex items-center justify-center text-muted-foreground">Loading chat...</div>;

  return (
    <div className="flex flex-col h-full bg-[#E5DDD5]/20 dark:bg-background border-l border-border">
      
      {/* Header */}
      <div className="h-16 border-b border-border bg-card flex items-center px-6 shrink-0 shadow-sm z-10">
        <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold mr-4">
          {recipientName.charAt(0)}
        </div>
        <div>
          <h2 className="font-bold text-foreground">{recipientName}</h2>
          <p className="text-xs text-muted-foreground flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-success"></span> Online
          </p>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 relative">
        {messages.length === 0 ? (
          <div className="h-full flex items-center justify-center flex-col text-muted-foreground">
            <div className="p-4 bg-primary/10 rounded-full mb-4">
              <svg className="w-8 h-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <p>Send a message to start the conversation.</p>
          </div>
        ) : (
          messages.map((msg, index) => {
            const isOwn = msg.senderId === currentUserId;
            return (
              <MessageBubble
                key={msg.id || index}
                content={msg.content}
                timestamp={msg.timestamp}
                isOwn={isOwn}
                status={msg.status}
              />
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 bg-card border-t border-border shrink-0">
        <form onSubmit={handleSend} className="flex items-center gap-2 max-w-4xl mx-auto">
          <input 
            type="text" 
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Type a message..." 
            className="flex-1 h-12 bg-muted/50 rounded-full px-6 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all border border-transparent focus:border-primary/30"
          />
          <button 
            type="submit" 
            disabled={!inputValue.trim()}
            className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center disabled:opacity-50 hover:bg-primary/90 transition-colors shadow-md"
          >
            <svg className="w-5 h-5 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </button>
        </form>
      </div>

    </div>
  );
};
