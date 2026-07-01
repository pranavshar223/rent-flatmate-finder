import { axiosInstance } from './axios';

export const AuthApi = {
  login: async (email: string, providerToken: string) => {
    const response = await axiosInstance.post('/auth/login', {
      email,
      providerToken
    });
    return response.data;
  },

  register: async (email: string, name: string, role: string, providerToken: string, phone?: string) => {
    const response = await axiosInstance.post('/auth/register', {
      email,
      name,
      role: role.toUpperCase(), // Backend expects OWNER or TENANT
      providerToken,
      phone
    });
    return response.data;
  }
};
