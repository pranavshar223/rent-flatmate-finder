import { axiosInstance as api } from './axios';

export const compatibilityApi = {
  getCompatibility: async (roomId: string) => {
    // If backend doesn't have an endpoint for single compatibility yet, you can use a fallback or the real endpoint
    const response = await api.get<{ status: string; data: any }>(`/compatibility/${roomId}`);
    return response.data;
  }
};
