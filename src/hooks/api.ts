import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import toast from 'react-hot-toast';
import { authApi, ticketsApi, commentsApi, usersApi, notificationsApi } from '../lib/api-services';

// Auth hooks
export const useLogin = () => {
  return useMutation({
    mutationFn: authApi.login,
    onSuccess: (data) => {
      localStorage.setItem('access_token', data.tokens.access);
      localStorage.setItem('refresh_token', data.tokens.refresh);
      
      // Trigger auth change event to notify AuthContext
      window.dispatchEvent(new Event('auth-change'));
      
      toast.success('Login successful! Welcome back.');
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Login failed. Please try again.');
    },
  });
};

export const useLogout = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: () => {
      const refreshToken = localStorage.getItem('refresh_token');
      if (!refreshToken) throw new Error('No refresh token found');
      return authApi.logout(refreshToken);
    },
    onSuccess: () => {
      // Don't clear tokens here - AuthContext handles this
      // Don't show toast here - AuthContext handles this
      // Just clear React Query cache
      queryClient.clear();
    },
    onError: () => {
      // Don't show error toast - logout locally succeeded even if backend fails
      // Just clear React Query cache
      queryClient.clear();
    },
  });
};

export const useRegister = () => {
  return useMutation({
    mutationFn: authApi.register,
    onSuccess: (data) => {
      localStorage.setItem('access_token', data.tokens.access);
      localStorage.setItem('refresh_token', data.tokens.refresh);
      toast.success('Registration successful! Welcome to the platform.');
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Registration failed. Please try again.');
    },
  });
};

export const useProfile = () => {
  const token = localStorage.getItem('access_token');
  
  return useQuery({
    queryKey: ['profile'],
    queryFn: authApi.getProfile,
    enabled: !!token,
    retry: false, // Don't retry on 401 errors
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useCurrentUser = () => {
  const token = localStorage.getItem('access_token');
  
  return useQuery({
    queryKey: ['currentUser'],
    queryFn: authApi.getCurrentUser,
    enabled: !!token,
    retry: false, // Don't retry on 401 errors
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: authApi.updateProfile,
    onSuccess: (updatedUser) => {
      // Update both profile and currentUser caches
      queryClient.setQueryData(['profile'], updatedUser);
      queryClient.setQueryData(['currentUser'], updatedUser);
      toast.success('Profile updated successfully!');
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Failed to update profile.');
    },
  });
};

// Hook without toast for combined operations
export const useUpdateProfileSilent = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: authApi.updateProfile,
    onSuccess: (updatedUser) => {
      // Update both profile and currentUser caches
      queryClient.setQueryData(['profile'], updatedUser);
      queryClient.setQueryData(['currentUser'], updatedUser);
    },
  });
};

export const useChangePassword = () => {
  return useMutation({
    mutationFn: authApi.changePassword,
    onSuccess: () => {
      toast.success('Password changed successfully!');
    },
    onError: (error: any) => {
      // Handle specific validation errors from the enhanced API service
      if (error.message) {
        toast.error(error.message);
      } else {
        toast.error(error?.response?.data?.message || 'Failed to change password.');
      }
    },
  });
};

export const useUploadProfilePicture = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: authApi.uploadProfilePicture,
    onSuccess: () => {
      // Invalidate and refetch both profile and currentUser queries
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      queryClient.invalidateQueries({ queryKey: ['currentUser'] });
      // Also force refetch to ensure immediate update
      queryClient.refetchQueries({ queryKey: ['profile'] });
      queryClient.refetchQueries({ queryKey: ['currentUser'] });
      toast.success('Profile picture uploaded successfully!');
    },
    onError: (error: any) => {
      const errorMessage = error?.response?.data?.profile_picture?.[0] || 
                          error?.response?.data?.message || 
                          'Failed to upload profile picture.';
      toast.error(errorMessage);
    },
  });
};

// Hook without toast for combined operations
export const useUploadProfilePictureSilent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: authApi.uploadProfilePicture,
    onSuccess: () => {
      // Invalidate and refetch both profile and currentUser queries
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      queryClient.invalidateQueries({ queryKey: ['currentUser'] });
      // Also force refetch to ensure immediate update
      queryClient.refetchQueries({ queryKey: ['profile'] });
      queryClient.refetchQueries({ queryKey: ['currentUser'] });
    },
  });
};

export const useDeleteProfilePicture = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: authApi.deleteProfilePicture,
    onSuccess: () => {
      // Invalidate and refetch both profile and currentUser queries
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      queryClient.invalidateQueries({ queryKey: ['currentUser'] });
      // Also force refetch to ensure immediate update
      queryClient.refetchQueries({ queryKey: ['profile'] });
      queryClient.refetchQueries({ queryKey: ['currentUser'] });
      toast.success('Profile picture deleted successfully!');
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Failed to delete profile picture.');
    },
  });
};

// Hook without toast for combined operations
export const useDeleteProfilePictureSilent = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: authApi.deleteProfilePicture,
    onSuccess: () => {
      // Invalidate and refetch both profile and currentUser queries
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      queryClient.invalidateQueries({ queryKey: ['currentUser'] });
      // Also force refetch to ensure immediate update
      queryClient.refetchQueries({ queryKey: ['profile'] });
      queryClient.refetchQueries({ queryKey: ['currentUser'] });
    },
  });
};

// Tickets hooks
export const useTickets = (params?: { 
  status?: string; 
  assigned_to?: number;
  created_by?: number;
  search?: string;
}) => {
  console.log('useTickets hook called with params:', params, 'at', new Date().toLocaleTimeString());
  
  const query = useQuery({
    queryKey: ['tickets', params],
    queryFn: () => ticketsApi.getTickets(params),
    staleTime: 0, // Always consider data stale for fresh fetches
    refetchInterval: 5000, // Poll every 5 seconds for updates
    refetchIntervalInBackground: true, // Continue polling in background
  });
  
  // Debug logging
  useEffect(() => {
    if (query.data) {
      console.log('useTickets data updated:', query.data?.results?.length, 'tickets at', new Date().toLocaleTimeString());
    }
  }, [query.data]);
  
  return query;
};

export const useTicket = (id: number) => {
  return useQuery({
    queryKey: ['tickets', id],
    queryFn: () => ticketsApi.getTicket(id),
    enabled: !!id,
    staleTime: 0, // Always consider data stale for immediate updates
    gcTime: 5 * 60 * 1000, // Keep in cache for 5 minutes
    refetchOnWindowFocus: true, // Refetch when window gains focus for latest data
    refetchOnMount: false, // Don't refetch on mount if data is fresh
  });
};

// Prefetch helper for ticket details on hover
export const usePrefetchTicket = () => {
  const queryClient = useQueryClient();
  
  return (id: number) => {
    queryClient.prefetchQuery({
      queryKey: ['tickets', id],
      queryFn: () => ticketsApi.getTicket(id),
      staleTime: 1 * 60 * 1000,
    });
  };
};

export const useCreateTicket = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ticketsApi.createTicket,
    onSuccess: () => {
      // Invalidate ticket list queries
      queryClient.invalidateQueries({ queryKey: ['tickets'], type: 'all' });
      // Invalidate notification queries to refresh unread count for ICT/admin users
      queryClient.invalidateQueries({ queryKey: ['notifications'], type: 'all' });
      // Force immediate notification refresh for real-time updates
      queryClient.refetchQueries({ queryKey: ['notifications', 'unread-count'] });
      queryClient.refetchQueries({ queryKey: ['notifications', 'unread'] });
      toast.success('Ticket created successfully!');
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Failed to create ticket.');
    },
  });
};

export const useUpdateTicket = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ ticketId, data }: { ticketId: number; data: any }) => 
      ticketsApi.updateTicket(ticketId, data),
    onSuccess: async (updatedTicket, variables) => {
      console.log('Ticket updated successfully, refreshing cache...', variables);
      
      // Update the specific ticket in cache if we get updated data back
      if (updatedTicket) {
        queryClient.setQueryData(['tickets', variables.ticketId], updatedTicket);
      }
      
      // Remove all ticket queries from cache to force fresh data
      queryClient.removeQueries({ queryKey: ['tickets'] });
      
      // Small delay to ensure cache is cleared
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Invalidate all ticket-related queries
      await queryClient.invalidateQueries({ queryKey: ['tickets'] });
      
      // Force immediate refetch of all ticket queries
      await queryClient.refetchQueries({ queryKey: ['tickets'], type: 'all' });
      
      console.log('Cache refresh completed');
      toast.success('Ticket updated successfully!');
    },
    onError: (error: any) => {
      console.error('Ticket update failed:', error);
      toast.error(error?.response?.data?.message || 'Failed to update ticket.');
    },
  });
};

export const useAssignTicket = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ ticketId, assignedToId }: { ticketId: number; assignedToId: number }) => 
      ticketsApi.assignTicket(ticketId, assignedToId),
    onSuccess: (_, variables) => {
      // Remove all cached ticket data to force fresh fetch
      queryClient.removeQueries({ queryKey: ['tickets'] });
      
      // Invalidate and refetch all ticket queries for immediate updates
      queryClient.invalidateQueries({ queryKey: ['tickets'] });
      queryClient.invalidateQueries({ queryKey: ['tickets', variables.ticketId] });
      
      // Force refetch all ticket queries immediately
      queryClient.refetchQueries({ queryKey: ['tickets'], type: 'all' });
      queryClient.refetchQueries({ queryKey: ['tickets', variables.ticketId] });
      toast.success('Ticket assigned successfully!');
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Failed to assign ticket.');
    },
  });
};

export const useDeleteTicket = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ticketsApi.deleteTicket,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tickets'] });
      toast.success('Ticket deleted successfully!');
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Failed to delete ticket.');
    },
  });
};

// Comments hooks
export const useTicketComments = (ticketId: number) => {
  return useQuery({
    queryKey: ['comments', 'ticket', ticketId],
    queryFn: () => commentsApi.getTicketComments(ticketId),
    enabled: !!ticketId,
    refetchInterval: 10000, // Refetch every 10 seconds for comments (more frequent for chat-like experience)
    refetchIntervalInBackground: true,
    staleTime: 0,
    select: (data) => {
      // Ensure we always return an array
      if (Array.isArray(data)) {
        return data;
      }
      if (data && Array.isArray(data.results)) {
        return data.results;
      }
      return [];
    }
  });
};

export const useCreateComment = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ ticketId, commentData }: { ticketId: number; commentData: { message: string } }) => 
      commentsApi.createComment(ticketId, commentData),
    onSuccess: (_, variables) => {
      // Invalidate and refetch comment queries for immediate updates
      queryClient.invalidateQueries({ queryKey: ['comments', 'ticket', variables.ticketId] });
      queryClient.invalidateQueries({ queryKey: ['tickets', variables.ticketId] });
      queryClient.invalidateQueries({ queryKey: ['tickets'] }); // Update comment counts in ticket list
      // Also invalidate notifications as comments trigger notifications
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      queryClient.refetchQueries({ queryKey: ['comments', 'ticket', variables.ticketId] });
      queryClient.refetchQueries({ queryKey: ['tickets', variables.ticketId] });
      queryClient.refetchQueries({ queryKey: ['tickets'] });
      // Force immediate notification refresh
      queryClient.refetchQueries({ queryKey: ['notifications', 'unread-count'] });
      toast.success('Comment added successfully!');
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Failed to add comment.');
    },
  });
};

export const useUpdateComment = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ commentId, commentData }: { commentId: number; commentData: { message: string } }) => 
      commentsApi.updateComment(commentId, commentData),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['comments', 'ticket', data.ticket] });
      toast.success('Comment updated successfully!');
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Failed to update comment.');
    },
  });
};

export const useDeleteComment = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: commentsApi.deleteComment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments'] });
      toast.success('Comment deleted successfully!');
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Failed to delete comment.');
    },
  });
};

// Real-time update hooks
export const useRealTimeTickets = (params?: { 
  status?: string; 
  assigned_to?: number;
  created_by?: number;
  search?: string;
}) => {
  const { data, isLoading, error, isFetching, dataUpdatedAt } = useTickets(params);
  
  return {
    data,
    isLoading,
    error,
    isUpdating: isFetching && !isLoading, // Show when background refetch is happening
    lastUpdated: dataUpdatedAt,
  };
};

export const useRealTimeComments = (ticketId: number) => {
  const { data, isLoading, error, isFetching, dataUpdatedAt } = useTicketComments(ticketId);
  
  return {
    data,
    isLoading,
    error,
    isUpdating: isFetching && !isLoading,
    lastUpdated: dataUpdatedAt,
  };
};

// Real-time notification hook
export const useRealTimeNotifications = () => {
  const queryClient = useQueryClient();
  
  // Listen for new tickets/comments
  useEffect(() => {
    // Listen for query invalidations (which happen when new data arrives)
    const unsubscribe = queryClient.getQueryCache().subscribe((event) => {
      if (event.type === 'updated' && event.action.type === 'success') {
        const queryKey = event.query.queryKey;
        
        // Show notification for new tickets (except for the user who created it)
        if (queryKey[0] === 'tickets' && queryKey.length === 1) {
          // This fires when tickets list is updated
          // You can add more sophisticated logic here to detect truly new items
        }
      }
    });

    return unsubscribe;
  }, [queryClient]);
};

// User Management hooks (for admin)
export const useUsers = (params?: {
  role?: string;
  department?: string;
  is_active?: boolean;
  search?: string;
}) => {
  return useQuery({
    queryKey: ['users', params],
    queryFn: () => usersApi.getUsers(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useUser = (userId: number) => {
  return useQuery({
    queryKey: ['users', userId],
    queryFn: () => usersApi.getUser(userId),
    enabled: !!userId,
  });
};

export const useCreateUser = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: usersApi.createUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast.success('User created successfully!');
    },
    onError: (error: any) => {
      console.error('Create user error:', error);
      
      // Handle different types of errors
      let errorMessage = 'Failed to create user. Please try again.';
      
      if (error?.response?.data) {
        const errorData = error.response.data;
        
        // Handle validation errors (field-specific)
        if (errorData.email) {
          errorMessage = `Email error: ${Array.isArray(errorData.email) ? errorData.email[0] : errorData.email}`;
        } else if (errorData.username) {
          errorMessage = `Username error: ${Array.isArray(errorData.username) ? errorData.username[0] : errorData.username}`;
        } else if (errorData.password) {
          errorMessage = `Password error: ${Array.isArray(errorData.password) ? errorData.password[0] : errorData.password}`;
        } else if (errorData.non_field_errors) {
          errorMessage = Array.isArray(errorData.non_field_errors) ? errorData.non_field_errors[0] : errorData.non_field_errors;
        } else if (errorData.detail) {
          errorMessage = errorData.detail;
        } else if (errorData.message) {
          errorMessage = errorData.message;
        } else if (typeof errorData === 'string') {
          errorMessage = errorData;
        }
      } else if (error?.message) {
        errorMessage = error.message;
      }
      
      toast.error(errorMessage);
    },
  });
};

export const useUpdateUser = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ userId, userData }: { userId: number; userData: any }) => 
      usersApi.updateUser(userId, userData),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      queryClient.invalidateQueries({ queryKey: ['users', variables.userId] });
      toast.success('User updated successfully!');
    },
    onError: (error: any) => {
      console.error('Update user error:', error);
      
      // Handle different types of errors
      let errorMessage = 'Failed to update user. Please try again.';
      
      if (error?.response?.data) {
        const errorData = error.response.data;
        
        // Handle validation errors (field-specific)
        if (errorData.email) {
          errorMessage = `Email error: ${Array.isArray(errorData.email) ? errorData.email[0] : errorData.email}`;
        } else if (errorData.username) {
          errorMessage = `Username error: ${Array.isArray(errorData.username) ? errorData.username[0] : errorData.username}`;
        } else if (errorData.non_field_errors) {
          errorMessage = Array.isArray(errorData.non_field_errors) ? errorData.non_field_errors[0] : errorData.non_field_errors;
        } else if (errorData.detail) {
          errorMessage = errorData.detail;
        } else if (errorData.message) {
          errorMessage = errorData.message;
        } else if (typeof errorData === 'string') {
          errorMessage = errorData;
        }
      } else if (error?.message) {
        errorMessage = error.message;
      }
      
      toast.error(errorMessage);
    },
  });
};

export const useDeleteUser = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: usersApi.deleteUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast.success('User deleted successfully!');
    },
    onError: (error: any) => {
      const errorMessage = error?.response?.data?.message || 
                          'Failed to delete user. Please try again.';
      toast.error(errorMessage);
    },
  });
};

export const useUserStats = () => {
  return useQuery({
    queryKey: ['userStats'],
    queryFn: usersApi.getUserStats,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

// Notification hooks
export const useNotifications = (params?: {
  is_read?: boolean;
  notification_type?: string;
  page?: number;
  page_size?: number;
}) => {
  return useQuery({
    queryKey: ['notifications', params],
    queryFn: () => notificationsApi.getNotifications(params),
    staleTime: 30 * 1000, // 30 seconds
  });
};

export const useUnreadNotifications = () => {
  return useQuery({
    queryKey: ['notifications', 'unread'],
    queryFn: notificationsApi.getUnreadNotifications,
    staleTime: 5 * 1000, // 5 seconds
    refetchInterval: 15 * 1000, // Refetch every 15 seconds
    refetchOnWindowFocus: true, // Refetch when window gets focus
    refetchOnReconnect: true, // Refetch when network reconnects
  });
};

export const useUnreadCount = () => {
  return useQuery({
    queryKey: ['notifications', 'unread-count'],
    queryFn: notificationsApi.getUnreadCount,
    staleTime: 5 * 1000, // 5 seconds
    refetchInterval: 15 * 1000, // Refetch every 15 seconds (even more frequent)
    refetchOnWindowFocus: true, // Refetch when window gets focus
    refetchOnReconnect: true, // Refetch when network reconnects
  });
};

export const useMarkNotificationAsRead = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: notificationsApi.markAsRead,
    onSuccess: () => {
      // Immediately invalidate and refetch notification queries
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      // Force immediate refetch
      queryClient.refetchQueries({ queryKey: ['notifications', 'unread'] });
      queryClient.refetchQueries({ queryKey: ['notifications', 'unread-count'] });
      toast.success('Notification marked as read.');
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Failed to mark notification as read.');
    },
  });
};

export const useMarkAllNotificationsAsRead = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: notificationsApi.markAllAsRead,
    onSuccess: () => {
      // Immediately invalidate and refetch notification queries
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      // Force immediate refetch
      queryClient.refetchQueries({ queryKey: ['notifications', 'unread'] });
      queryClient.refetchQueries({ queryKey: ['notifications', 'unread-count'] });
      toast.success('All notifications marked as read.');
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Failed to mark all notifications as read.');
    },
  });
};

export const useDeleteNotification = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: notificationsApi.deleteNotification,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      toast.success('Notification deleted successfully.');
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Failed to delete notification.');
    },
  });
};
