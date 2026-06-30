const prisma = require('../config/prisma');

class RoomRepository {
  static async createRoomWithImages(roomData, imageUrls, tx = prisma) {
    return tx.room.create({
      data: {
        ...roomData,
        images: {
          create: imageUrls.map((url) => ({ imageUrl: url })),
        },
      },
      include: { images: true },
    });
  }

  static async findRoomById(id) {
    return prisma.room.findUnique({
      where: { id },
      include: { images: true },
    });
  }

  static async findOwnerRooms(ownerId) {
    return prisma.room.findMany({
      where: { ownerId },
      include: { images: true },
    });
  }

  static async updateRoom(id, updateData) {
    return prisma.room.update({
      where: { id },
      data: updateData,
      include: { images: true },
    });
  }

  static async markAsFilled(id) {
    return prisma.room.update({
      where: { id },
      data: { isFilled: true },
      include: { images: true },
    });
  }

  static async deleteRoom(id) {
    return prisma.room.delete({
      where: { id },
    });
  }
}

module.exports = RoomRepository;
