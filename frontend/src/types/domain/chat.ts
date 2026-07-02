export type MessageStatus = 'SENDING' | 'SENT' | 'DELIVERED' | 'SEEN' | 'FAILED';

export interface MessageDomain {
  id: string;
  chatId: string;
  senderId: string;
  text: string;
  status: MessageStatus;
  createdAt: Date;
  senderName?: string;
}

export interface ChatDomain {
  id: string;
  interestRequestId: string;
  tenantId: string;
  tenantName: string;
  tenantAvatarUrl: string | null;
  ownerId: string;
  ownerName: string;
  ownerAvatarUrl: string | null;
  roomTitle: string;
  unreadCount: number;
  latestMessageText?: string;
  latestMessageCreatedAt?: Date;
  updatedAt: Date;
}
