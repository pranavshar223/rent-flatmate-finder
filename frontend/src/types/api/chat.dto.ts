export interface ChatMessage {
  id: string;
  chatId: string;
  senderId: string;
  message: string;
  status: 'SENDING' | 'SENT' | 'DELIVERED' | 'SEEN' | 'FAILED'; // Note: SENDING and FAILED are UI-only states
  createdAt: string;
  tempId?: string;
  sender?: {
    id: string;
    name: string;
  };
}

export interface Chat {
  id: string;
  interestRequestId: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  interestRequest: {
    tenantId: string;
    room: {
      ownerId: string;
      title: string;
    };
    tenant: {
      id: string;
      name: string;
      avatarUrl?: string | null;
    };
  };
  messages?: ChatMessage[];
  unreadCount?: number;
}

export interface CursorMessageResponse {
  nextCursor: string | null;
  totalItems: number;
  items: ChatMessage[];
}

export interface ChatListResponse {
  status: string;
  data: Chat[];
}

export interface ChatMessageListResponse {
  status: string;
  data: CursorMessageResponse;
}

export interface ChatDetailsResponse {
  status: string;
  data: Chat;
}
