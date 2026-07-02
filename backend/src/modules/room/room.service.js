const RoomRepository = require('../../repositories/room.repository');
const cloudinary = require('../../providers/cloudinary.provider');
const { NotFoundError, AuthorizationError, ValidationError } = require('../../shared/errors');
const prisma = require('../../config/prisma');
const streamifier = require('streamifier');
const eventEmitter = require('../../shared/events/eventEmitter');
const { EVENTS } = require('../../shared/events/events.constants');

class RoomService {
  static async uploadImageToCloudinary(buffer) {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { folder: 'rent_flatmate_finder/rooms' },
        (error, result) => {
          if (error) return reject(error);
          resolve(result.secure_url);
        }
      );
      streamifier.createReadStream(buffer).pipe(uploadStream);
    });
  }

  static async createRoom(ownerId, roomData, imageFiles) {
    if (!imageFiles || imageFiles.length === 0) {
      throw new ValidationError('At least one image is required.');
    }

    // 1. Upload images to Cloudinary FIRST
    const uploadPromises = imageFiles.map((file) => this.uploadImageToCloudinary(file.buffer));
    let imageUrls;
    try {
      imageUrls = await Promise.all(uploadPromises);
    } catch (err) {
      throw new Error('Image upload failed. Please try again.');
    }

    // 2. Database Transaction for Room & Images
    try {
      const room = await RoomRepository.createRoomWithImages(
        { ...roomData, ownerId, availableFrom: new Date(roomData.availableFrom) },
        imageUrls
      );
      console.info(`[INFO] Room Created: ID ${room.id} by Owner ${ownerId}`);
      eventEmitter.emit(EVENTS.ROOM_CREATED, { roomId: room.id, ownerId, timestamp: new Date().toISOString() });
      return room;
    } catch (dbError) {
      // Rollback Cloudinary images on DB failure
      for (const url of imageUrls) {
        try {
          const publicId = url.split('/').slice(-2).join('/').split('.')[0];
          await cloudinary.uploader.destroy(publicId);
        } catch (e) {
          console.error('Failed to cleanup Cloudinary image:', url);
        }
      }
      throw dbError;
    }
  }

  static async getOwnerRooms(ownerId) {
    // Exclude filled rooms from public search, but for owner, show all
    return RoomRepository.findOwnerRooms(ownerId);
  }

  static async getRoomById(roomId) {
    const room = await RoomRepository.findRoomById(roomId);
    if (!room) throw new NotFoundError('Room not found.');
    return room;
  }

  static async updateRoom(roomId, ownerId, updateData) {
    const room = await this.getRoomById(roomId);
    if (room.ownerId !== ownerId) {
      throw new AuthorizationError('You can only edit your own rooms.');
    }

    if (updateData.availableFrom) {
      updateData.availableFrom = new Date(updateData.availableFrom);
    }

    const updatedRoom = await RoomRepository.updateRoom(roomId, updateData);
    console.info(`[INFO] Room Updated: ID ${roomId} by Owner ${ownerId}`);
    eventEmitter.emit(EVENTS.ROOM_UPDATED, { roomId, ownerId, timestamp: new Date().toISOString() });
    return updatedRoom;
  }

  static async toggleStatus(roomId, ownerId) {
    const room = await this.getRoomById(roomId);
    if (room.ownerId !== ownerId) {
      throw new AuthorizationError('You can only modify your own rooms.');
    }

    const newStatus = !room.isFilled;
    const updatedRoom = await RoomRepository.toggleStatus(roomId, newStatus);
    
    console.info(`[INFO] Room Status Toggled: ID ${roomId} isFilled=${newStatus} by Owner ${ownerId}`);
    
    // We can emit a generic ROOM_UPDATED event or keep ROOM_FILLED if newStatus is true
    if (newStatus) {
      eventEmitter.emit(EVENTS.ROOM_FILLED, { roomId, ownerId, timestamp: new Date().toISOString() });
    } else {
      eventEmitter.emit(EVENTS.ROOM_UPDATED, { roomId, ownerId, timestamp: new Date().toISOString() });
    }
    
    return updatedRoom;
  }

  static async deleteRoom(roomId, ownerId) {
    const room = await this.getRoomById(roomId);
    if (room.ownerId !== ownerId) {
      throw new AuthorizationError('You can only delete your own rooms.');
    }

    // Delete images from Cloudinary
    for (const image of room.images) {
      try {
        const publicId = image.imageUrl.split('/').slice(-2).join('/').split('.')[0];
        await cloudinary.uploader.destroy(publicId);
      } catch (err) {
        console.error('Cloudinary delete error:', err);
      }
    }

    // Database Transaction to delete images then room
    await prisma.$transaction(async (tx) => {
      await tx.roomImage.deleteMany({ where: { roomId } });
      await tx.room.delete({ where: { id: roomId } });
    });

    console.info(`[INFO] Room Deleted: ID ${roomId} by Owner ${ownerId}`);
    eventEmitter.emit(EVENTS.ROOM_DELETED, { roomId, ownerId, timestamp: new Date().toISOString() });
    return true;
  }
}

module.exports = RoomService;
