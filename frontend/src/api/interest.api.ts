import { api } from './axios';
import type { Interest } from '../types/interest';

export const interestApi = {
  // Tenant
  createInterest: async (data: { roomId: string; message?: string }) => {
    const response = await api.post<{ status: string; data: Interest }>('/interests', data);
    return response.data;
  },

  getTenantRequests: async () => {
    const response = await api.get<{ status: string; data: Interest[] }>('/interests/me');
    return response.data;
  },

  cancelRequest: async (id: string) => {
    const response = await api.delete<{ status: string; message: string }>(`/interests/${id}`);
    return response.data;
  },

  // Owner
  getOwnerRequests: async () => {
    const response = await api.get<{ status: string; data: Interest[] }>('/interests/owner');
    return response.data;
  },

  acceptRequest: async (id: string) => {
    const response = await api.patch<{ status: string; data: Interest }>(`/interests/${id}/accept`);
    return response.data;
  },

  rejectRequest: async (id: string) => {
    const response = await api.patch<{ status: string; data: Interest }>(`/interests/${id}/reject`);
    return response.data;
  },

  // Shared
  getRequestById: async (id: string) => {
    const response = await api.get<{ status: string; data: Interest }>(`/interests/${id}`);
    return response.data;
  }
};
