const eventEmitter = require('./eventEmitter');
const { EVENTS } = require('./events.constants');
const CompatibilityService = require('../../modules/compatibility/compatibility.service');
const ChatService = require('../../modules/chat/chat.service');

const registerListeners = () => {
  // Wrapper to catch errors inside listeners so they don't crash the main application thread
  const safeExecute = (fn) => async (data) => {
    try {
      await fn(data);
    } catch (error) {
      console.error(`[EVENT ERROR] Listener failed for data: ${JSON.stringify(data)}`, error);
    }
  };

  // Profile Updates -> Recalculate for Tenant
  eventEmitter.on(EVENTS.TENANT_PROFILE_CREATED, safeExecute(async ({ userId }) => {
    console.info(`[BATCH] Starting compatibility recalculation for Tenant: ${userId}`);
    await CompatibilityService.recalculateForTenant(userId);
  }));

  eventEmitter.on(EVENTS.TENANT_PROFILE_UPDATED, safeExecute(async ({ userId }) => {
    console.info(`[BATCH] Starting compatibility recalculation for Tenant: ${userId}`);
    await CompatibilityService.recalculateForTenant(userId);
  }));

  // Room Updates -> Recalculate for Room
  eventEmitter.on(EVENTS.ROOM_CREATED, safeExecute(async ({ roomId }) => {
    console.info(`[BATCH] Starting compatibility recalculation for Room: ${roomId}`);
    await CompatibilityService.recalculateForRoom(roomId);
  }));

  eventEmitter.on(EVENTS.ROOM_UPDATED, safeExecute(async ({ roomId }) => {
    console.info(`[BATCH] Starting compatibility recalculation for Room: ${roomId}`);
    await CompatibilityService.recalculateForRoom(roomId);
  }));

  // Interest Accepted -> Create Chat
  eventEmitter.on(EVENTS.INTEREST_ACCEPTED, safeExecute(async ({ interestId }) => {
    console.info(`[BATCH] Creating chat for accepted interest: ${interestId}`);
    await ChatService.createChatFromInterest(interestId);
  }));
};

module.exports = { registerListeners };
