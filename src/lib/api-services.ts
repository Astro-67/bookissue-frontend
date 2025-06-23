import api from './api';
import type { LoginCredentials, RegisterData } from '../types/api';

// Auth API services matching your backend endpoints
export const authApi = {
  login: async (credentials: LoginCredentials) => {
    const response = await api.post('/users/auth/login/', credentials);
    return response.data;
  },
  
  logout: async (refreshToken: string) => {
    const response = await api.post('/users/auth/logout/', { refresh: refreshToken });
    return response.data;
  },
  
  register: async (userData: RegisterData) => {
    const response = await api.post('/users/auth/register/', userData);
    return response.data;
  },
  
  refreshToken: async (refreshToken: string) => {
    const response = await api.post('/users/auth/token/refresh/', { refresh: refreshToken });
    return response.data;
  },
  
  getProfile: async () => {
    const response = await api.get('/users/profile/');
    return response.data;
  },

  getCurrentUser: async () => {
    const response = await api.get('/users/me/');
    return response.data;
  },

  changePassword: async (passwordData: {
    old_password: string;
    new_password: string;
    confirm_password: string;
  }) => {
    const response = await api.post('/users/profile/change-password/', passwordData);
    return response.data;
  },
};

export default {
  auth: authApi,
};
