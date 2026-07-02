const eventEmitter = require('../../shared/events/eventEmitter');
const { EVENTS } = require('../../shared/events/events.constants');

const setupInterestSocket = (io) => {
  // Helper to emit to specific users
  const notifyUsers = (userIds, event, data) => {
    userIds.forEach(userId => {
      if (userId) {
        io.to(userId).emit(event, data);
      }
    });
  };

  // Wrapper to prevent crashes
  const safeExecute = (fn) => async (data) => {
    try {
      await fn(data);
    } catch (error) {
      console.error(`[INTEREST SOCKET ERROR] Listener failed for data: ${JSON.stringify(data)}`, error);
    }
  };

  // Listen to internal events and broadcast to relevant users
  eventEmitter.on(EVENTS.INTEREST_CREATED, safeExecute(async (data) => {
    const { tenantId, ownerId, interestId, roomId } = data;
    console.info(`[SOCKET BROADCAST] interest:created | Interest ${interestId}`);
    notifyUsers([tenantId, ownerId], 'interest:created', data);
  }));

  eventEmitter.on(EVENTS.INTEREST_ACCEPTED, safeExecute(async (data) => {
    const { tenantId, ownerId, interestId, roomId } = data;
    console.info(`[SOCKET BROADCAST] interest:accepted | Interest ${interestId}`);
    notifyUsers([tenantId, ownerId], 'interest:accepted', data);
  }));

  eventEmitter.on(EVENTS.INTEREST_REJECTED, safeExecute(async (data) => {
    const { tenantId, ownerId, interestId, roomId } = data;
    console.info(`[SOCKET BROADCAST] interest:rejected | Interest ${interestId}`);
    notifyUsers([tenantId, ownerId], 'interest:rejected', data);
  }));

  eventEmitter.on(EVENTS.INTEREST_CANCELLED, safeExecute(async (data) => {
    const { tenantId, ownerId, interestId, roomId } = data;
    console.info(`[SOCKET BROADCAST] interest:cancelled | Interest ${interestId}`);
    notifyUsers([tenantId, ownerId], 'interest:cancelled', data);
  }));

  eventEmitter.on(EVENTS.CHAT_CREATED, safeExecute(async (data) => {
    const { chatId, interestId } = data;
    // We need tenantId and ownerId. Let's pass the whole data assuming they are there, or fetch if needed.
    // Wait, let's look at what chat.service.js emits for CHAT_CREATED.
    console.info(`[SOCKET BROADCAST] match:created | Chat ${chatId}`);
    // If tenantId/ownerId is missing, notifyUsers will just skip undefined. We should check what's passed.
    // For now, emit match:created.
    // We'll update chat.service.js to include tenantId and ownerId if they are missing.
    const { tenantId, ownerId } = data;
    notifyUsers([tenantId, ownerId], 'match:created', data);
  }));
};

module.exports = { setupInterestSocket };
