const jwt = require('jsonwebtoken');
const env = require('../../config/env');
const ChatService = require('./chat.service');
const UserRepository = require('../../repositories/user.repository');

const setupChatSocket = (io) => {
  // Socket.IO Authentication Middleware
  io.use((socket, next) => {
    try {
      const token = socket.handshake.auth.token || socket.handshake.query.token;
      if (!token) return next(new Error('Authentication token missing'));

      const decoded = jwt.verify(token, env.JWT_SECRET);
      socket.user = decoded;
      next();
    } catch (err) {
      next(new Error('Invalid or expired token'));
    }
  });

  io.on('connection', (socket) => {
    const userId = socket.user.userId;
    console.info(`[SOCKET] Connected: Socket ${socket.id} | User ${userId}`);

    // Join a room specifically for this user to allow direct messaging
    socket.join(userId);

    // Broadcast online status
    socket.broadcast.emit('chat:online', { userId, timestamp: new Date().toISOString() });

    // JOIN CHAT
    socket.on('chat:join', async ({ chatId }) => {
      try {
        await ChatService.getChatDetails(chatId, userId); // Authorizes participant
        socket.join(chatId);
        socket.emit('chat:joined', { chatId });
        console.info(`[SOCKET] User ${userId} joined room ${chatId}`);
      } catch (error) {
        socket.emit('chat:error', { message: error.message });
      }
    });

    // LEAVE CHAT
    socket.on('chat:leave', ({ chatId }) => {
      socket.leave(chatId);
      console.info(`[SOCKET] User ${userId} left room ${chatId}`);
    });

    // SEND MESSAGE
    socket.on('chat:message', async (data) => {
      const { chatId, content, tempId } = data;
      const startTime = Date.now();

      try {
        // Save to DB initially as SENT
        const savedMessage = await ChatService.saveMessage(chatId, userId, content);
        
        // Broadcast to all other sockets in the chat room
        socket.to(chatId).emit('chat:message', savedMessage);
        
        // Confirm delivery back to sender with tempId for mapping
        socket.emit('chat:delivered', { ...savedMessage, tempId });
        
        console.info(`[SOCKET LOG] Message Broadcasted | Chat ${chatId} | Latency ${Date.now() - startTime}ms`);
      } catch (error) {
        socket.emit('chat:error', { message: error.message, errorType: 'MESSAGE_SEND_FAILED' });
      }
    });

    // BATCH READ RECEIPTS
    socket.on('message:read', async ({ chatId }) => {
      try {
        // Update all unread messages in this chat from the other person
        await ChatService.markMessagesAsRead(chatId, userId);
        
        // Broadcast that messages have been read
        socket.to(chatId).emit('chat:read', { chatId, readBy: userId, timestamp: new Date().toISOString() });
      } catch (error) {
        console.error(`[SOCKET] Error marking messages as read:`, error);
      }
    });

    // TYPING INDICATORS
    socket.on('typing:start', ({ chatId }) => {
      socket.to(chatId).emit('chat:typing', { userId, chatId });
    });

    socket.on('typing:stop', ({ chatId }) => {
      socket.to(chatId).emit('chat:stop_typing', { userId, chatId });
    });

    // DISCONNECT
    socket.on('disconnect', async () => {
      console.info(`[SOCKET] Disconnected: Socket ${socket.id} | User ${userId}`);
      
      // Update last seen
      try {
        await UserRepository.updateLastSeen(userId);
      } catch (e) {
        console.error('Failed to update last seen', e);
      }
      
      // Broadcast offline status
      socket.broadcast.emit('chat:offline', { userId, lastSeenAt: new Date().toISOString() });
    });
  });
};

module.exports = { setupChatSocket };
