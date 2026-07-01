import { api } from './axios';
import type { Room } from '../types/room';

export const roomApi = {
  createRoom: async (formData: FormData) => {
    // We must send multipart/form-data because of image uploads
    const response = await api.post<{ status: string; data: Room }>('/rooms', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  getOwnerRooms: async () => {
    const response = await api.get<{ status: string; data: Room[] }>('/rooms/my');
    return response.data;
  },

  getRoomById: async (id: string) => {
    const response = await api.get<{ status: string; data: Room }>(`/rooms/${id}`);
    return response.data;
  },

  updateRoom: async (id: string, data: Partial<Room>) => {
    const response = await api.put<{ status: string; data: Room }>(`/rooms/${id}`, data);
    return response.data;
  },

  markAsFilled: async (id: string) => {
    const response = await api.patch<{ status: string; data: Room }>(`/rooms/${id}/fill`);
    return response.data;
  },

  deleteRoom: async (id: string) => {
    const response = await api.delete<{ status: string; message: string }>(`/rooms/${id}`);
    return response.data;
  }
};
