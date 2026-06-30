const eventEmitter = require('../../shared/events/eventEmitter');
const { EVENTS } = require('../../shared/events/events.constants');
const NotificationService = require('./notification.service');
const NotificationDTO = require('./notification.dto');
const prisma = require('../../config/prisma');

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
    return prisma.room.findUnique({ where: { id: roomId }, select: { title: true } });
  };

  eventEmitter.on(EVENTS.INTEREST_CREATED, safeExecute(async ({ tenantId, ownerId, roomId }) => {
    const owner = await getUser(ownerId);
    const tenant = await getUser(tenantId);
    const room = await getRoom(roomId);
    const scoreRecord = await prisma.compatibilityScore.findFirst({ where: { tenantId, roomId } });

    const dto = new NotificationDTO({
      type: 'INTEREST_CREATED',
      recipient: owner,
      channel: 'EMAIL',
      payload: {
        ownerName: owner.name,
        tenantName: tenant.name,
        roomTitle: room.title,
        compatibilityScore: scoreRecord ? scoreRecord.score : null,
      },
    });

    NotificationService.processNotification(dto);
  }));

  eventEmitter.on(EVENTS.INTEREST_ACCEPTED, safeExecute(async ({ tenantId, ownerId, roomId }) => {
    const owner = await getUser(ownerId);
    const tenant = await getUser(tenantId);
    const room = await getRoom(roomId);

    const dto = new NotificationDTO({
      type: 'INTEREST_ACCEPTED',
      recipient: tenant,
      channel: 'EMAIL',
      payload: {
        ownerName: owner.name,
        tenantName: tenant.name,
        roomTitle: room.title,
      },
    });

    NotificationService.processNotification(dto);
  }));

  eventEmitter.on(EVENTS.INTEREST_REJECTED, safeExecute(async ({ tenantId, ownerId, roomId }) => {
    const owner = await getUser(ownerId);
    const tenant = await getUser(tenantId);
    const room = await getRoom(roomId);

    const dto = new NotificationDTO({
      type: 'INTEREST_REJECTED',
      recipient: tenant,
      channel: 'EMAIL',
      payload: {
        ownerName: owner.name,
        tenantName: tenant.name,
        roomTitle: room.title,
      },
    });

    NotificationService.processNotification(dto);
  }));

  eventEmitter.on(EVENTS.CHAT_CREATED, safeExecute(async ({ interestId }) => {
    const interest = await prisma.interestRequest.findUnique({ where: { id: interestId }, include: { room: true } });
    if (!interest) return;
    
    const owner = await getUser(interest.room.ownerId);
    const tenant = await getUser(interest.tenantId);

    // Notify Tenant
    NotificationService.processNotification(new NotificationDTO({
      type: 'CHAT_CREATED',
      recipient: tenant,
      channel: 'EMAIL',
      payload: { roomTitle: interest.room.title },
    }));

    // Notify Owner
    NotificationService.processNotification(new NotificationDTO({
      type: 'CHAT_CREATED',
      recipient: owner,
      channel: 'EMAIL',
      payload: { roomTitle: interest.room.title },
    }));
  }));

  eventEmitter.on(EVENTS.ROOM_FILLED, safeExecute(async ({ ownerId, roomId }) => {
    const owner = await getUser(ownerId);
    const room = await getRoom(roomId);

    NotificationService.processNotification(new NotificationDTO({
      type: 'ROOM_FILLED',
      recipient: owner,
      channel: 'EMAIL',
      payload: {
        ownerName: owner.name,
        roomTitle: room.title,
      },
    }));
  }));

  eventEmitter.on(EVENTS.USER_REGISTERED, safeExecute(async ({ userId }) => {
    const user = await getUser(userId);
    NotificationService.processNotification(new NotificationDTO({
      type: 'USER_REGISTERED',
      recipient: user,
      channel: 'EMAIL',
      payload: { userName: user.name },
    }));
  }));
};

module.exports = { registerNotificationListeners };
