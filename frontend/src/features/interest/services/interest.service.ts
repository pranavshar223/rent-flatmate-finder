import { InterestRepository } from '../../../mocks/repositories/InterestRepository';
import { ChatRepository } from '../../../mocks/repositories/ChatRepository';
import { RoomRepository } from '../../../mocks/repositories/RoomRepository';

// This acts as the frontend service layer that will later use Axios
export const InterestService = {
  create: async (roomId: string, tenantId: string, message: string) => {
    // Simulate network delay
    await new Promise(r => setTimeout(r, 600));

    const room = await RoomRepository.findById(roomId);
    if (!room) throw new Error('Room not found');

    const newInterest = {
      id: `req_${Date.now()}`,
      roomId,
      tenantId,
      ownerId: room.ownerId,
      status: 'pending',
      message,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      tenantName: 'Alex (Tenant)',
      tenantCompatibility: room.compatibility?.score || 0,
      roomTitle: room.title
    };

    return await InterestRepository.save(newInterest);
  },

  accept: async (requestId: string) => {
    await new Promise(r => setTimeout(r, 600));
    
    const request = await InterestRepository.findById(requestId);
    if (!request) throw new Error('Request not found');

    request.status = 'accepted';
    request.updatedAt = new Date().toISOString();
    await InterestRepository.save(request);

    // Create Chat Thread upon acceptance
    const newChat = {
      id: `chat_${Date.now()}`,
      requestId: request.id,
      tenantId: request.tenantId,
      ownerId: request.ownerId,
      tenantName: request.tenantName,
      ownerName: 'Owner', // mocked
      lastMessage: 'Chat unlocked!',
      timestamp: new Date().toISOString(),
      unreadCountTenant: 1,
      unreadCountOwner: 0,
    };
    await ChatRepository.save(newChat);

    return request;
  },

  reject: async (requestId: string) => {
    await new Promise(r => setTimeout(r, 600));
    const request = await InterestRepository.findById(requestId);
    if (!request) throw new Error('Request not found');

    request.status = 'rejected';
    request.updatedAt = new Date().toISOString();
    await InterestRepository.save(request);

    return request;
  },

  cancel: async (requestId: string) => {
    await new Promise(r => setTimeout(r, 600));
    const request = await InterestRepository.findById(requestId);
    if (!request) throw new Error('Request not found');

    request.status = 'cancelled';
    request.updatedAt = new Date().toISOString();
    await InterestRepository.save(request);

    return request;
  },

  getTenantRequests: async (tenantId: string) => {
    await new Promise(r => setTimeout(r, 400));
    return await InterestRepository.findByTenantId(tenantId);
  },

  getOwnerRequests: async (ownerId: string) => {
    await new Promise(r => setTimeout(r, 400));
    return await InterestRepository.findByOwnerId(ownerId);
  }
};
