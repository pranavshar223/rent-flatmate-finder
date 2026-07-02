const http = require('http');
const { Server } = require('socket.io');
const app = require('./app');
const env = require('./config/env');
const { setupChatSocket } = require('./modules/chat/chat.socket');
const { setupInterestSocket } = require('./modules/interest/interest.socket');

const PORT = env.PORT || 5000;

const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: '*', methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'] },
});

setupChatSocket(io);
setupInterestSocket(io);

server.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT} in ${env.NODE_ENV} mode.`);
});

// Handle unhandled rejections globally
process.on('unhandledRejection', (err) => {
  console.error('UNHANDLED REJECTION! 💥 Shutting down...');
  console.error(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});
