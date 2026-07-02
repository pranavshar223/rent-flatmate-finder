import { useState } from 'react';
import { ChatList } from './ChatList';
import { ChatWindow } from './ChatWindow';
import { useChats } from '../hooks/useChats';
import { useRealtimeChat } from '../hooks/useRealtimeChat';

interface ChatAppProps {
  currentUserId: string;
}

export const ChatApp = ({ currentUserId }: ChatAppProps) => {
  const [activeChatId, setActiveChatId] = useState<string | undefined>();
  const [isMobileListOpen, setIsMobileListOpen] = useState(true);

  const { data: chats = [], isLoading } = useChats();
  const { isUserOnline } = useRealtimeChat();

  const handleSelectChat = (chatId: string) => {
    setActiveChatId(chatId);
    setIsMobileListOpen(false);
  };

  if (isLoading) return <div className="p-8 text-center text-muted-foreground">Loading chats...</div>;

  const activeChat = chats.find(c => c.id === activeChatId);
  const recipientId = activeChat 
    ? (currentUserId === activeChat.tenantId ? activeChat.ownerId : activeChat.tenantId)
    : '';
  const recipientName = activeChat 
    ? (currentUserId === activeChat.tenantId ? activeChat.ownerName : activeChat.tenantName)
    : '';
  const recipientAvatarUrl = activeChat
    ? (currentUserId === activeChat.tenantId ? activeChat.ownerAvatarUrl : activeChat.tenantAvatarUrl)
    : undefined;
  const isRecipientOnline = isUserOnline(recipientId);

  return (
    <div className="flex h-[calc(100vh-140px)] bg-card border border-border rounded-xl shadow-sm overflow-hidden relative">
      
      {/* Sidebar List */}
      <div className={`w-full md:w-80 lg:w-96 shrink-0 bg-muted/10 h-full absolute md:relative z-20 transition-transform duration-300 ${isMobileListOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
        <div className="h-16 border-b border-border flex items-center px-4 bg-card">
          <h2 className="text-lg font-bold">Chats</h2>
        </div>
        <div className="h-[calc(100%-4rem)]">
          <ChatList 
            chats={chats} 
            activeChatId={activeChatId} 
            onSelectChat={handleSelectChat}
            currentUserId={currentUserId}
            isUserOnline={isUserOnline}
          />
        </div>
      </div>

      {/* Chat Window */}
      <div className="flex-1 h-full w-full absolute md:relative z-10">
        {!isMobileListOpen && (
          <button 
            onClick={() => setIsMobileListOpen(true)}
            className="md:hidden absolute top-4 left-4 z-50 p-2 bg-background/80 rounded-full shadow-sm"
          >
            <svg className="w-5 h-5 text-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
        )}
        
        {activeChatId ? (
          <ChatWindow 
            chatId={activeChatId} 
            currentUserId={currentUserId} 
            recipientName={recipientName}
            recipientAvatarUrl={recipientAvatarUrl}
            isOnline={isRecipientOnline}
          />
        ) : (
          <div className="h-full hidden md:flex flex-col items-center justify-center bg-muted/10 text-muted-foreground">
            <svg className="w-16 h-16 mb-4 opacity-20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            <p className="text-lg font-medium">Select a chat to start messaging</p>
          </div>
        )}
      </div>

    </div>
  );
};
