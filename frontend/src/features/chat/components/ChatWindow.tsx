import { useEffect, useRef, useState } from 'react';
import { MessageBubble } from './MessageBubble';
import { UserAvatar } from '../../../components/ui/UserAvatar';
import { useMessages } from '../hooks/useMessages';

interface ChatWindowProps {
  chatId: string;
  currentUserId: string;
  recipientName: string;
  recipientAvatarUrl?: string | null;
  isOnline?: boolean;
}

export const ChatWindow = ({ chatId, currentUserId, recipientName, recipientAvatarUrl, isOnline }: ChatWindowProps) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const typingTimeoutRef = useRef<number | null>(null);

  const { 
    messages, 
    isLoading, 
    fetchNextPage, 
    hasNextPage, 
    isFetchingNextPage,
    sendMessage,
    sendTypingEvent,
    isOtherUserTyping
  } = useMessages(chatId);

  // Backend returns newest first, so we reverse it for display
  const displayMessages = [...messages].reverse();

  // Scroll to bottom when new messages are added at the bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages.length > 0 ? messages[0].id : null]); // Only trigger when latest message changes

  const handleScroll = () => {
    if (!containerRef.current) return;
    
    // If scrolled to top (which is actually near 0 because we reversed display or naturally at 0)
    if (containerRef.current.scrollTop <= 50 && hasNextPage && !isFetchingNextPage) {
      // Save current scroll height to restore position after loading older messages
      const previousScrollHeight = containerRef.current.scrollHeight;
      
      fetchNextPage().then(() => {
        if (containerRef.current) {
          const newScrollHeight = containerRef.current.scrollHeight;
          containerRef.current.scrollTop = newScrollHeight - previousScrollHeight;
        }
      });
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);

    // Debounced Typing Indicator
    if (!isTyping) {
      setIsTyping(true);
      sendTypingEvent(true);
    }
    
    if (typingTimeoutRef.current) window.clearTimeout(typingTimeoutRef.current);
    
    typingTimeoutRef.current = window.setTimeout(() => {
      setIsTyping(false);
      sendTypingEvent(false);
    }, 2000); // 2 seconds idle
  };

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;
    
    const content = inputValue.trim();
    sendMessage(content);
    
    if (typingTimeoutRef.current) window.clearTimeout(typingTimeoutRef.current);
    setIsTyping(false);
    sendTypingEvent(false);
    
    setInputValue('');
  };

  return (
    <div className="flex flex-col h-full bg-[#E5DDD5]/20 dark:bg-background border-l border-border relative">
      
      {/* Header */}
      <div className="h-16 border-b border-border bg-card flex items-center px-6 shrink-0 shadow-sm z-10">
        <div className="w-10 h-10 rounded-full flex items-center justify-center text-primary font-bold mr-4 overflow-hidden shrink-0">
          <UserAvatar avatarUrl={recipientAvatarUrl} name={recipientName} className="w-full h-full text-base" />
        </div>
        <div>
          <h2 className="font-bold text-foreground">{recipientName}</h2>
          <p className="text-xs text-muted-foreground flex items-center gap-1">
            {isOnline ? (
              <><span className="w-2 h-2 rounded-full bg-success"></span> Online</>
            ) : (
              <><span className="w-2 h-2 rounded-full bg-muted-foreground"></span> Offline</>
            )}
          </p>
        </div>
      </div>

      {/* Messages Area */}
      <div 
        ref={containerRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto p-4 space-y-4 relative flex flex-col"
      >
        {isFetchingNextPage && (
          <div className="text-center text-xs text-muted-foreground py-2">Loading older messages...</div>
        )}

        {isLoading ? (
          <div className="flex-1 flex items-center justify-center text-muted-foreground">Loading chat history...</div>
        ) : displayMessages.length === 0 ? (
          <div className="flex-1 flex items-center justify-center flex-col text-muted-foreground">
            <div className="p-4 bg-primary/10 rounded-full mb-4">
              <svg className="w-8 h-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <p>Send a message to start the conversation.</p>
          </div>
        ) : (
          <div className="flex-1 flex flex-col justify-end min-h-0">
            {displayMessages.map((msg) => (
              <MessageBubble
                key={msg.id}
                content={msg.text}
                timestamp={msg.createdAt.toISOString()}
                isOwn={msg.senderId === currentUserId}
                status={msg.status}
              />
            ))}
            {isOtherUserTyping && (
              <div className="flex w-full justify-start mt-2">
                <div className="bg-card text-muted-foreground rounded-2xl rounded-bl-none border border-border px-4 py-2 text-sm shadow-sm">
                  <div className="flex gap-1 items-center h-5">
                    <span className="w-1.5 h-1.5 bg-muted-foreground/50 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                    <span className="w-1.5 h-1.5 bg-muted-foreground/50 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                    <span className="w-1.5 h-1.5 bg-muted-foreground/50 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 bg-card border-t border-border shrink-0">
        <form onSubmit={handleSend} className="flex items-center gap-2 max-w-4xl mx-auto">
          <input 
            type="text" 
            value={inputValue}
            onChange={handleInputChange}
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
