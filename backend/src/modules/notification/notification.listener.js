const eventEmitter = require('../../shared/events/eventEmitter');
const { EVENTS } = require('../../shared/events/events.constants');
const NotificationService = require('./notification.service');
const prisma = require('../../config/prisma');
const env = require('../../config/env');

const registerNotificationListeners = () => {
  const safeExecute = (fn) => async (data) => {
    try {
      await fn(data);
    } catch (error) {
      console.error(`[NOTIFICATION LISTENER ERROR] Failed to process event data: ${JSON.stringify(data)}`, error);
    }
  };

  const getUser = async (userId) => {
    return prisma.user.findUnique({ where: { id: userId }, select: { id: true, email: true, name: true } });
  };
  
  const getRoom = async (roomId) => {
    return prisma.room.findUnique({ where: { id: roomId }, select: { id: true, title: true } });
  };

  eventEmitter.on(EVENTS.INTEREST_CREATED, safeExecute(async ({ tenantId, ownerId, roomId }) => {
    const owner = await getUser(ownerId);
    const tenant = await getUser(tenantId);
    const room = await getRoom(roomId);
    const scoreRecord = await prisma.compatibilityScore.findFirst({ where: { tenantId, roomId } });

    if (scoreRecord && scoreRecord.score >= env.COMPATIBILITY_THRESHOLD) {
      await NotificationService.sendHighMatchAlert(owner, tenant, room, scoreRecord.score);
    }
  }));

  eventEmitter.on(EVENTS.INTEREST_ACCEPTED, safeExecute(async ({ tenantId, ownerId, roomId }) => {
    const owner = await getUser(ownerId);
    const tenant = await getUser(tenantId);
    const room = await getRoom(roomId);

    await NotificationService.sendInterestAccepted(tenant, owner, room);
  }));

  eventEmitter.on(EVENTS.INTEREST_REJECTED, safeExecute(async ({ tenantId, ownerId, roomId }) => {
    const owner = await getUser(ownerId);
    const tenant = await getUser(tenantId);
    const room = await getRoom(roomId);

    await NotificationService.sendInterestRejected(tenant, room);
  }));

  eventEmitter.on(EVENTS.USER_REGISTERED, safeExecute(async ({ userId }) => {
    const user = await getUser(userId);
    await NotificationService.sendWelcomeEmail(user);
  }));
};

module.exports = { registerNotificationListeners };
