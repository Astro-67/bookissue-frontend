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

  updateProfile: async (profileData: {
    first_name?: string;
    last_name?: string;
    phone_number?: string;
    email?: string;
  }) => {
    const response = await api.patch('/users/profile/', profileData);
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

// Tickets API
export const ticketsApi = {  getTickets: async (params?: {
    status?: string;
    assigned_to?: number;
    created_by?: number;
    search?: string;
  }) => {
    const response = await api.get('/tickets/', { params });
    // Return the full response to preserve pagination structure
    return response.data;
  },
  
  getTicket: async (id: number) => {
    const response = await api.get(`/tickets/${id}/`);
    return response.data;
  },
  
  createTicket: async (ticketData: {
    title: string;
    description: string;
    screenshot?: File;
  }) => {
    // Always use FormData to handle both file and non-file cases consistently
    const formData = new FormData();
    formData.append('title', ticketData.title);
    formData.append('description', ticketData.description);
    
    // Only append screenshot if it exists and is a File
    if (ticketData.screenshot && ticketData.screenshot instanceof File) {
      formData.append('screenshot', ticketData.screenshot);
    }
    
    // Configure request with explicit headers
    const config = {
      transformRequest: [(data: any) => data], // Don't transform FormData
    };
    
    const response = await api.post('/tickets/', formData, config);
    return response.data;
  },
  
  updateTicket: async (id: number, ticketData: any) => {
    const response = await api.patch(`/tickets/${id}/`, ticketData);
    return response.data;
  },
  
  deleteTicket: async (id: number) => {
    const response = await api.delete(`/tickets/${id}/`);
    return response.data;
  },
  
  assignTicket: async (id: number, assignedToId: number) => {
    const response = await api.post(`/tickets/${id}/assign/`, { assigned_to_id: assignedToId });
    return response.data;
  },
};

// Comments API
export const commentsApi = {
  getTicketComments: async (ticketId: number) => {
    const response = await api.get(`/comments/tickets/${ticketId}/comments/`);
    // Return the full response to preserve pagination structure
    return response.data;
  },
  
  createComment: async (ticketId: number, commentData: {
    message: string;
  }) => {
    const response = await api.post(`/comments/tickets/${ticketId}/comments/`, commentData);
    return response.data;
  },
  
  getComment: async (commentId: number) => {
    const response = await api.get(`/comments/${commentId}/`);
    return response.data;
  },
  
  updateComment: async (commentId: number, commentData: {
    message: string;
  }) => {
    const response = await api.patch(`/comments/${commentId}/`, commentData);
    return response.data;
  },
  
  deleteComment: async (commentId: number) => {
    const response = await api.delete(`/comments/${commentId}/`);
    return response.data;
  },
};

export default {
  auth: authApi,
  tickets: ticketsApi,
  comments: commentsApi,
};
