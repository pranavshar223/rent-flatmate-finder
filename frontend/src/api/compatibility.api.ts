import { axiosInstance as api } from './axios';
import type { CompatibilityResponseDto, CompatibilityScoreDto } from '../types/api/compatibility.dto';

export const compatibilityApi = {
  getTenantCompatibilities: async () => {
    const response = await api.get<{ status: string; data: CompatibilityScoreDto[] }>('/compatibility/bulk/tenant');
    return response.data;
  },
  getCompatibility: async (roomId: string) => {
    const response = await api.get<CompatibilityResponseDto>(`/compatibility/${roomId}`);
    return response.data;
  },
  askQuestion: async (roomId: string, question: string) => {
    const response = await api.post<{ status: string; data: { answer: string } }>(`/compatibility/${roomId}/ask`, { question });
    return response.data.data.answer;
  }
};
