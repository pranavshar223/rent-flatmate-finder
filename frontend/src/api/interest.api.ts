import { axiosInstance as api } from './axios';

import type { InterestListResponse, InterestStatusResponse } from '../types/api/interest.dto';

export const interestApi = {
  // Tenant
  createInterest: async (data: { roomId: string; message?: string }) => {
    const response = await api.post<InterestStatusResponse>('/interests', data);
    return response.data;
  },

  getTenantRequests: async () => {
    const response = await api.get<InterestListResponse>('/interests/me');
    return response.data;
  },

  cancelRequest: async (id: string) => {
    const response = await api.delete<{ status: string; message: string }>(`/interests/${id}`);
    return response.data;
  },

  // Owner
  getOwnerRequests: async () => {
    const response = await api.get<InterestListResponse>('/interests/owner');
    return response.data;
  },

  acceptRequest: async (id: string) => {
    const response = await api.patch<InterestStatusResponse>(`/interests/${id}/accept`);
    return response.data;
  },

  rejectRequest: async (id: string) => {
    const response = await api.patch<InterestStatusResponse>(`/interests/${id}/reject`);
    return response.data;
  },

  // Shared
  getRequestById: async (id: string) => {
    const response = await api.get<InterestStatusResponse>(`/interests/${id}`);
    return response.data;
  }
};
