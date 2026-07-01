export const mockMessages = [
  {
    id: 'msg_1',
    chatId: 'chat_1',
    senderId: 'tenant1',
    content: 'Hi! Is this room still available?',
    timestamp: new Date(Date.now() - 3600000).toISOString(),
    status: 'read'
  },
  {
    id: 'msg_2',
    chatId: 'chat_1',
    senderId: 'owner2',
    content: 'Yes, it is still available!',
    timestamp: new Date(Date.now() - 3500000).toISOString(),
    status: 'read'
  }
];
