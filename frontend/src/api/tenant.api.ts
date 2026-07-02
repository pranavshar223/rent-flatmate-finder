import { axiosInstance as api } from './axios';
import type { UpdateTenantProfileRequest, TenantProfileResponse, RoomFilterRequest } from '../types/api/tenant.dto';
import type { Room } from '../types/room';

export const tenantApi = {
  createProfile: async (data: UpdateTenantProfileRequest) => {
    const response = await api.post<{ status: string; data: TenantProfileResponse }>('/tenant/profile', data);
    return response.data;
  },

  getProfile: async () => {
    const response = await api.get<{ status: string; data: TenantProfileResponse }>('/tenant/profile');
    return response.data;
  },

  updateProfile: async (data: UpdateTenantProfileRequest) => {
    const response = await api.put<{ status: string; data: TenantProfileResponse }>('/tenant/profile', data);
    return response.data;
  },

  browseRooms: async (filters: RoomFilterRequest) => {
    // Axios automatically serializes the `params` object into a query string
    const response = await api.get<{ status: string; data: { items: Room[], totalItems: number, totalPages: number, currentPage: number } }>('/tenant/rooms', {
      params: filters
    });
    return response.data;
  },
};
