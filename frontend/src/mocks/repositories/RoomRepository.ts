import { mockRooms } from '../data/rooms';

let rooms = [...mockRooms];

export const RoomRepository = {
  findAll: async () => [...rooms],
  findById: async (id: string) => rooms.find(r => r.id === id),
  save: async (room: any) => {
    const idx = rooms.findIndex(r => r.id === room.id);
    if (idx >= 0) rooms[idx] = room;
    else rooms.push(room);
    return room;
  }
};
