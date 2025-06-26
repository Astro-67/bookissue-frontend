import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import toast from 'react-hot-toast';
import { authApi, ticketsApi, commentsApi } from '../lib/api-services';

// Auth hooks
export const useLogin = () => {
  return useMutation({
    mutationFn: authApi.login,
    onSuccess: (data) => {
      localStorage.setItem('access_token', data.tokens.access);
      localStorage.setItem('refresh_token', data.tokens.refresh);
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
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      queryClient.clear();
      toast.success('Logged out successfully.');
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Logout failed.');
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

export const useChangePassword = () => {
  return useMutation({
    mutationFn: authApi.changePassword,
    onSuccess: () => {
      toast.success('Password changed successfully!');
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Failed to change password.');
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
  return useQuery({
    queryKey: ['tickets', params],
    queryFn: () => ticketsApi.getTickets(params),
    refetchInterval: 30000, // Refetch every 30 seconds for real-time updates
    refetchIntervalInBackground: true, // Continue refetching when tab is not focused
    staleTime: 0, // Always consider data stale to ensure fresh updates
  });
};

export const useTicket = (id: number) => {
  return useQuery({
    queryKey: ['tickets', id],
    queryFn: () => ticketsApi.getTicket(id),
    enabled: !!id,
    refetchInterval: 15000, // Refetch every 15 seconds for ticket details
    refetchIntervalInBackground: true,
    staleTime: 0,
  });
};

export const useCreateTicket = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ticketsApi.createTicket,
    onSuccess: () => {
      // Invalidate all ticket queries to ensure immediate updates across all views
      queryClient.invalidateQueries({ queryKey: ['tickets'] });
      // Force refetch immediately
      queryClient.refetchQueries({ queryKey: ['tickets'] });
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
    onSuccess: (_, variables) => {
      // Invalidate and refetch all ticket queries for immediate updates
      queryClient.invalidateQueries({ queryKey: ['tickets'] });
      queryClient.invalidateQueries({ queryKey: ['tickets', variables.ticketId] });
      queryClient.refetchQueries({ queryKey: ['tickets'] });
      queryClient.refetchQueries({ queryKey: ['tickets', variables.ticketId] });
      toast.success('Ticket updated successfully!');
    },
    onError: (error: any) => {
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
      // Invalidate and refetch all ticket queries for immediate updates
      queryClient.invalidateQueries({ queryKey: ['tickets'] });
      queryClient.invalidateQueries({ queryKey: ['tickets', variables.ticketId] });
      queryClient.refetchQueries({ queryKey: ['tickets'] });
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
      queryClient.refetchQueries({ queryKey: ['comments', 'ticket', variables.ticketId] });
      queryClient.refetchQueries({ queryKey: ['tickets', variables.ticketId] });
      queryClient.refetchQueries({ queryKey: ['tickets'] });
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
