const jwt = require('jsonwebtoken');
const env = require('../../config/env');
const ChatService = require('./chat.service');

const onlineUsers = new Map(); // Map<userId, Set<socketId>>

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

    // Track online user presence
    if (!onlineUsers.has(userId)) {
      onlineUsers.set(userId, new Set());
    }
    onlineUsers.get(userId).add(socket.id);

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
      const { chatId, content } = data;
      const startTime = Date.now();

      try {
        // Must save to Database first!
        const savedMessage = await ChatService.saveMessage(chatId, userId, content);
        
        // Broadcast to all other sockets in the chat room
        socket.to(chatId).emit('chat:newMessage', savedMessage);
        
        // Confirm delivery back to sender
        socket.emit('chat:messageDelivered', savedMessage);
        
        console.info(`[SOCKET LOG] Message Broadcasted | Chat ${chatId} | Latency ${Date.now() - startTime}ms`);
      } catch (error) {
        socket.emit('chat:error', { message: error.message });
      }
    });

    // TYPING INDICATORS
    socket.on('chat:typing', ({ chatId }) => {
      socket.to(chatId).emit('chat:typing', { userId, chatId });
    });

    socket.on('chat:stopTyping', ({ chatId }) => {
      socket.to(chatId).emit('chat:stopTyping', { userId, chatId });
    });

    // DISCONNECT
    socket.on('disconnect', () => {
      console.info(`[SOCKET] Disconnected: Socket ${socket.id} | User ${userId}`);
      if (onlineUsers.has(userId)) {
        onlineUsers.get(userId).delete(socket.id);
        if (onlineUsers.get(userId).size === 0) {
          onlineUsers.delete(userId);
        }
      }
    });
  });
};

module.exports = { setupChatSocket, onlineUsers };
