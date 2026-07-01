export interface Message {
  id: string;
  chatId: string;
  senderId: string;
  content: string;
  isRead: boolean;
  createdAt: string;
}

export interface Chat {
  id: string;
  roomId: string;
  tenantId: string;
  ownerId: string;
  createdAt: string;
  updatedAt: string;
  lastMessage?: Message;
}
