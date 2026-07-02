import { UserAvatar } from '../../../components/ui/UserAvatar';

interface ChatListProps {
  chats: any[];
  activeChatId?: string;
  onSelectChat: (chatId: string) => void;
  currentUserId: string;
  isUserOnline?: (userId: string) => boolean;
}

export const ChatList = ({ chats, activeChatId, onSelectChat, currentUserId, isUserOnline }: ChatListProps) => {
  if (chats.length === 0) {
    return <div className="p-8 text-center text-muted-foreground text-sm">No conversations yet.</div>;
  }

  return (
    <div className="divide-y divide-border h-full overflow-y-auto">
      {chats.map(chat => {
        const isTenant = currentUserId === chat.tenantId;
        const displayName = isTenant ? chat.ownerName : chat.tenantName;
        const avatarUrl = isTenant ? chat.ownerAvatarUrl : chat.tenantAvatarUrl;
        const unreadCount = isTenant ? chat.unreadCountTenant : chat.unreadCountOwner;
        const isActive = activeChatId === chat.id;

        return (
          <div 
            key={chat.id} 
            onClick={() => onSelectChat(chat.id)}
            className={`flex items-center gap-4 p-4 cursor-pointer transition-colors border-l-4 ${
              isActive 
                ? 'bg-muted/50 border-primary' 
                : 'border-transparent hover:bg-muted/30'
            }`}
          >
            <div className="w-12 h-12 rounded-full flex items-center justify-center shrink-0 relative overflow-visible">
              <div className="w-full h-full rounded-full overflow-hidden">
                <UserAvatar avatarUrl={avatarUrl} name={displayName} className="w-full h-full text-lg" />
              </div>
              {isUserOnline && isUserOnline(isTenant ? chat.ownerId : chat.tenantId) && (
                <div className="absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full bg-green-500 border-2 border-card z-10" />
              )}
              {unreadCount > 0 && (
                <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-primary flex items-center justify-center text-[10px] font-bold text-primary-foreground border-2 border-card z-10">
                  {unreadCount}
                </div>
              )}
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-baseline mb-0.5">
                <h4 className="font-semibold text-foreground truncate">{displayName}</h4>
                <span className="text-xs text-muted-foreground whitespace-nowrap ml-2">
                  {new Date(chat.updatedAt || chat.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
              <p className="text-xs text-primary font-medium truncate mb-0.5">{chat.roomTitle || 'Room Inquiry'}</p>
              <p className={`text-sm truncate ${unreadCount > 0 ? 'text-foreground font-semibold' : 'text-muted-foreground'}`}>
                {chat.lastMessage}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
};
