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
    // Map frontend field names to backend expected field names
    const backendData = {
      old_password: passwordData.old_password,
      new_password: passwordData.new_password,
      new_password_confirm: passwordData.confirm_password,
    };
    
    try {
      const response = await api.post('/users/profile/change-password/', backendData, {
        headers: {
          'Content-Type': 'application/json',
        }
      });
      return response.data;
    } catch (error: any) {
      
      // Extract and throw clear, user-friendly validation errors
      if (error.response?.data) {
        const errorData = error.response.data;
        
        // Handle password validation errors with user-friendly messages
        if (errorData.new_password && Array.isArray(errorData.new_password)) {
          const passwordErrors = errorData.new_password.map((err: string) => {
            // Convert Django error messages to user-friendly ones
            if (err.includes('too common')) {
              return 'This password is too common. Please choose a more unique password.';
            }
            if (err.includes('too similar')) {
              return 'Password is too similar to your personal information. Please choose a different password.';
            }
            if (err.includes('too short')) {
              return 'Password must be at least 8 characters long.';
            }
            if (err.includes('entirely numeric')) {
              return 'Password cannot be entirely numeric. Please include letters or symbols.';
            }
            if (err.includes('password_too_common')) {
              return 'This password is too common. Please choose a more unique password.';
            }
            if (err.includes('password_too_similar')) {
              return 'Password is too similar to your personal information.';
            }
            if (err.includes('password_too_short')) {
              return 'Password must be at least 8 characters long.';
            }
            if (err.includes('password_entirely_numeric')) {
              return 'Password cannot be entirely numeric.';
            }
            // Return original message if no specific match
            return err;
          });
          
          throw new Error(passwordErrors.join(' '));
        }
        
        // Handle old password errors
        if (errorData.old_password && Array.isArray(errorData.old_password)) {
          throw new Error('Current password is incorrect.');
        }
        
        // Handle password confirmation errors
        if (errorData.new_password_confirm && Array.isArray(errorData.new_password_confirm)) {
          throw new Error("Password confirmation doesn't match.");
        }
        
        // Handle non-field errors (like password mismatch)
        if (errorData.non_field_errors && Array.isArray(errorData.non_field_errors)) {
          const nonFieldErrors = errorData.non_field_errors.map((err: string) => {
            if (err.includes("don't match")) {
              return "New passwords don't match.";
            }
            return err;
          });
          throw new Error(nonFieldErrors.join(' '));
        }
      }
      
      throw error;
    }
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

// Users management API (for admin)
export const usersApi = {
  getUsers: async (params?: {
    role?: string;
    department?: string;
    is_active?: boolean;
    search?: string;
  }) => {
    const searchParams = new URLSearchParams();
    if (params?.role) searchParams.set('role', params.role);
    if (params?.department) searchParams.set('department', params.department);
    if (params?.is_active !== undefined) searchParams.set('is_active', params.is_active.toString());
    if (params?.search) searchParams.set('search', params.search);
    
    const response = await api.get(`/users/?${searchParams.toString()}`);
    return response.data;
  },

  getUser: async (userId: number) => {
    const response = await api.get(`/users/${userId}/`);
    return response.data;
  },

  createUser: async (userData: RegisterData) => {
    const response = await api.post('/users/create/', userData);
    return response.data;
  },

  updateUser: async (userId: number, userData: Partial<{
    email: string;
    first_name: string;
    last_name: string;
    role: string;
    phone_number: string;
    student_id: string;
    department: string;
    is_active: boolean;
  }>) => {
    const response = await api.patch(`/users/${userId}/`, userData);
    return response.data;
  },

  deleteUser: async (userId: number) => {
    const response = await api.delete(`/users/${userId}/`);
    return response.data;
  },

  getUserStats: async () => {
    const response = await api.get('/users/stats/');
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
  users: usersApi,
};
