import type { Chat, ChatMessage } from '../types/api/chat.dto';
import type { ChatDomain, MessageDomain } from '../types/domain/chat';

export function mapChatToDomain(chat: Chat): ChatDomain {
  const latestMessage = chat.messages?.[0];
  
  return {
    id: chat.id,
    interestRequestId: chat.interestRequest.tenantId, // For compatibility, though we just need ids
    tenantId: chat.interestRequest.tenantId,
    ownerId: chat.interestRequest.room.ownerId,
    ownerName: (chat.interestRequest.room as any).owner?.name || 'Owner', 
    ownerAvatarUrl: (chat.interestRequest.room as any).owner?.avatarUrl || null,
    tenantName: chat.interestRequest.tenant.name,
    tenantAvatarUrl: (chat.interestRequest.tenant as any).avatarUrl || null,
    roomTitle: chat.interestRequest.room.title,
    unreadCount: chat.unreadCount || 0,
    latestMessageText: latestMessage?.message,
    latestMessageCreatedAt: latestMessage ? new Date(latestMessage.createdAt) : undefined,
    updatedAt: new Date(chat.updatedAt || chat.createdAt),
  };
}

export function mapMessageToDomain(message: ChatMessage): MessageDomain & { tempId?: string } {
  return {
    id: message.id,
    chatId: message.chatId,
    senderId: message.senderId,
    text: message.message,
    status: message.status || 'SENT',
    createdAt: new Date(message.createdAt),
    senderName: message.sender?.name,
    tempId: message.tempId,
  };
}
