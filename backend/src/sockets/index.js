const jwt = require('jsonwebtoken');
const env = require('../config/env');
const { setupInterestSocket } = require('../modules/interest/interest.socket');
// const { setupChatSocket } = require('../modules/chat/chat.socket'); // For Phase 5

module.exports.registerSockets = (io) => {
  // Authentication Middleware
  io.use((socket, next) => {
    const token = socket.handshake.auth?.token;
    
    if (!token) {
      console.warn(`[SOCKET] Rejecting connection: No token provided (${socket.id})`);
      return next(new Error('Authentication error'));
    }

    try {
      const decoded = jwt.verify(token, env.JWT_SECRET);
      socket.user = decoded; // { userId, role, ... }
      next();
    } catch (error) {
      console.warn(`[SOCKET] Rejecting connection: Invalid token (${socket.id})`, error.message);
      return next(new Error('Authentication error'));
    }
  });

  io.on('connection', (socket) => {
    const userId = socket.user.userId;
    console.log(`[SOCKET] Connected: ${socket.id} (User: ${userId})`);

    // Join user's personal room for direct routing (supports multi-tab/device)
    socket.join(userId);

    // Register Feature Sockets
    setupInterestSocket(io);
    // setupChatSocket(io, socket); // Pass socket if needed for specific events, or just io

    socket.on('disconnect', (reason) => {
      console.log(`[SOCKET] Disconnected: ${socket.id} (User: ${userId}) - Reason: ${reason}`);
    });
  });
};
