const InterestRepository = require('../../repositories/interest.repository');
const RoomRepository = require('../../repositories/room.repository');
const { EVENTS } = require('../../shared/events/events.constants');
const eventEmitter = require('../../shared/events/eventEmitter');
const { NotFoundError, ConflictError, AuthorizationError, ValidationError } = require('../../shared/errors');
const prisma = require('../../config/prisma');
const env = require('../../config/env');
const CompatibilityService = require('../compatibility/compatibility.service');

class InterestService {
  static async createInterest(tenantId, roomId) {
    const startTime = Date.now();
    
    // 1. Check if room exists and is active
    const room = await RoomRepository.findRoomById(roomId);
    if (!room || room.deletedAt) throw new NotFoundError('Room not found.');
    if (room.isFilled) throw new ConflictError('Cannot request a filled room.');
    if (room.ownerId === tenantId) throw new AuthorizationError('You cannot send an interest request to your own room.');

    // 2. Check for duplicate pending request
    const hasPending = await InterestRepository.existsPendingRequest(tenantId, roomId);
    if (hasPending) throw new ConflictError('You already have a pending request for this room.');

    // 3. Check for high compatibility match
    const compatibility = await CompatibilityService.getRoomCompatibility(tenantId, roomId);
    let isHighMatch = false;
    if (compatibility && compatibility.score >= env.COMPATIBILITY_THRESHOLD) {
      isHighMatch = true;
      console.info(`[INFO] High Match Detected: Score ${compatibility.score} >= ${env.COMPATIBILITY_THRESHOLD}`);
    }

    // 4. Create request
    const request = await InterestRepository.createInterest({ tenantId, roomId, isHighMatch });

    console.info(`[INFO] Interest Created: Request ${request.id} | Tenant ${tenantId} | Room ${roomId} | Duration ${Date.now() - startTime}ms`);
    eventEmitter.emit(EVENTS.INTEREST_CREATED, { 
      interestId: request.id, 
      tenantId, 
      roomId, 
      ownerId: room.ownerId, 
      timestamp: new Date().toISOString() 
    });

    return request;
  }

  static async getTenantRequests(tenantId, filters, pagination) {
    return InterestRepository.findTenantRequests(tenantId, filters, pagination);
  }

  static async getOwnerRequests(ownerId, filters, pagination) {
    return InterestRepository.findOwnerRequests(ownerId, filters, pagination);
  }

  static async getRequestById(id, userId, role) {
    const request = await InterestRepository.findById(id);
    if (!request || request.deletedAt) throw new NotFoundError('Interest request not found.');

    if (role === 'TENANT' && request.tenantId !== userId) {
      throw new AuthorizationError('You are not authorized to view this request.');
    }
    if (role === 'OWNER' && request.room.ownerId !== userId) {
      throw new AuthorizationError('You are not authorized to view this request.');
    }

    return request;
  }

  static async acceptRequest(id, ownerId) {
    const startTime = Date.now();
    const request = await this.getRequestById(id, ownerId, 'OWNER');
    
    // Database Transaction
    const updatedRequest = await prisma.$transaction(async (tx) => {
      // Re-fetch inside transaction to ensure we have the latest status lock
      const currentReq = await tx.interestRequest.findUnique({ where: { id } });
      if (!currentReq || currentReq.status !== 'PENDING') {
        throw new ValidationError(`Cannot accept request. It is no longer in PENDING state.`);
      }

      return InterestRepository.updateStatus(id, 'ACCEPTED', tx);
    });

    console.info(`[INFO] Interest Accepted: Request ${id} | Owner ${ownerId} | Duration ${Date.now() - startTime}ms`);
    eventEmitter.emit(EVENTS.INTEREST_ACCEPTED, { 
      interestId: updatedRequest.id, 
      tenantId: updatedRequest.tenantId, 
      roomId: updatedRequest.roomId, 
      ownerId, 
      timestamp: new Date().toISOString() 
    });

    return updatedRequest;
  }

  static async rejectRequest(id, ownerId) {
    const startTime = Date.now();
    const request = await this.getRequestById(id, ownerId, 'OWNER');

    const updatedRequest = await prisma.$transaction(async (tx) => {
      const currentReq = await tx.interestRequest.findUnique({ where: { id } });
      if (!currentReq || currentReq.status !== 'PENDING') {
        throw new ValidationError(`Cannot reject request. It is no longer in PENDING state.`);
      }
      return InterestRepository.updateStatus(id, 'REJECTED', tx);
    });

    console.info(`[INFO] Interest Rejected: Request ${id} | Owner ${ownerId} | Duration ${Date.now() - startTime}ms`);
    eventEmitter.emit(EVENTS.INTEREST_REJECTED, { 
      interestId: updatedRequest.id, 
      tenantId: updatedRequest.tenantId, 
      roomId: updatedRequest.roomId, 
      ownerId, 
      timestamp: new Date().toISOString() 
    });

    return updatedRequest;
  }

  static async cancelRequest(id, tenantId) {
    const startTime = Date.now();
    const request = await this.getRequestById(id, tenantId, 'TENANT');

    if (request.status !== 'PENDING') {
      throw new ValidationError(`Cannot cancel request in ${request.status} state.`);
    }

    await InterestRepository.softDeleteInterest(id);
    console.info(`[INFO] Interest Cancelled: Request ${id} | Tenant ${tenantId} | Duration ${Date.now() - startTime}ms`);
    
    eventEmitter.emit(EVENTS.INTEREST_CANCELLED, {
      interestId: id,
      tenantId: request.tenantId,
      roomId: request.roomId,
      ownerId: request.room.ownerId,
      timestamp: new Date().toISOString()
    });

    return true;
  }
}

module.exports = InterestService;
