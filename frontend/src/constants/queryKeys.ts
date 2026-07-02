export const queryKeys = {
  tenant: ['tenant'],
  profile: ['profile'],
  rooms: ['rooms'],
  requests: ['requests'],
  compatibility: ['compatibility'],
  ownerRooms: ['ownerRooms'],
  ownerRequests: ['ownerRequests'],
  chats: ['chats'],
  chatMessages: (chatId: string) => ['chat', chatId, 'messages'],
  chatDetails: (chatId: string) => ['chat', chatId, 'details']
};
