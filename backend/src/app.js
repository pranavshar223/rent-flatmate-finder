const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

const globalErrorHandler = require('./middlewares/error.middleware');
const authRoutes = require('./modules/auth/auth.route');
const roomRoutes = require('./modules/room/room.route');
const tenantRoutes = require('./modules/tenant/tenant.route');
const compatibilityRoutes = require('./modules/compatibility/compatibility.route');
const interestRoutes = require('./modules/interest/interest.route');
const chatRoutes = require('./modules/chat/chat.route');
const adminRoutes = require('./modules/admin/admin.route');

const app = express();

// Initialize Event Listeners
const { registerListeners } = require('./shared/events/eventListeners');
const { registerNotificationListeners } = require('./modules/notification/notification.listener');
registerListeners();
registerNotificationListeners();

// Security middlewares
app.use(helmet());
app.use(cors());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
});
app.use('/api', limiter);

// Body parser
app.use(express.json());

// API Routes (v1)
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/rooms', roomRoutes);
app.use('/api/v1/tenant', tenantRoutes);
app.use('/api/v1/compatibility', compatibilityRoutes);
app.use('/api/v1/interests', interestRoutes);
app.use('/api/v1/chat', chatRoutes);
app.use('/api/v1/admin', adminRoutes);

// 404 Not Found Handler for unknown routes
app.use((req, res, next) => {
  const { NotFoundError } = require('./shared/errors');
  next(new NotFoundError(`Can't find ${req.originalUrl} on this server!`));
});

// Global Error Handler
app.use(globalErrorHandler);

module.exports = app;
