import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { authApi } from '../lib/api-services';

// Auth hooks
export const useLogin = () => {
  return useMutation({
    mutationFn: authApi.login,
    onSuccess: (data) => {
      localStorage.setItem('access_token', data.tokens.access);
      localStorage.setItem('refresh_token', data.tokens.refresh);
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
    },
  });
};

export const useRegister = () => {
  return useMutation({
    mutationFn: authApi.register,
    onSuccess: (data) => {
      localStorage.setItem('access_token', data.tokens.access);
      localStorage.setItem('refresh_token', data.tokens.refresh);
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
  });
};
