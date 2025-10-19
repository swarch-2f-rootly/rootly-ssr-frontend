import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { authClient } from './rest-client.js';
import type { User } from '../graphql/types';

// Query keys for auth
export const authKeys = {
  all: ['auth'] as const,
  profile: () => ['auth', 'profile'] as const,
};

// Auth response types
export interface LoginResponse {
  access_token: string;
  refresh_token: string;
  user: User;
}

export interface RegisterResponse {
  access_token: string;
  refresh_token: string;
  user: User;
}

export interface RefreshResponse {
  access_token: string;
  refresh_token: string;
}

// Get user profile
export function useProfile() {
  return useQuery({
    queryKey: authKeys.profile(),
    queryFn: () => authClient.get<User>('/api/v1/auth/profile'),
    staleTime: 5 * 60 * 1000, // 5 minutos
    gcTime: 15 * 60 * 1000, // 15 minutos
    retry: (failureCount, error: any) => {
      // Don't retry on 401 (unauthorized)
      if (error?.message?.includes('401')) {
        return false;
      }
      return failureCount < 3;
    },
  });
}

// Login mutation
export function useLogin() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (credentials: { email: string; password: string }) => 
      authClient.post<LoginResponse>('/api/v1/auth/login', credentials),
    onSuccess: (data) => {
      // Store tokens in localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('access_token', data.access_token);
        localStorage.setItem('refresh_token', data.refresh_token);
        localStorage.setItem('user', JSON.stringify(data.user));
      }
      
      // Set user data in cache
      queryClient.setQueryData(authKeys.profile(), data.user);
      
      // Trigger auth change event
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new Event('authChange'));
      }
    },
  });
}

// Register mutation
export function useRegister() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userData: { 
      email: string; 
      password: string; 
      first_name: string; 
      last_name: string; 
    }) => 
      authClient.post<RegisterResponse>('/api/v1/auth/register', userData),
    onSuccess: (data) => {
      // Store tokens in localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('access_token', data.access_token);
        localStorage.setItem('refresh_token', data.refresh_token);
        localStorage.setItem('user', JSON.stringify(data.user));
      }
      
      // Set user data in cache
      queryClient.setQueryData(authKeys.profile(), data.user);
      
      // Trigger auth change event
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new Event('authChange'));
      }
    },
  });
}

// Logout mutation
export function useLogout() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => {
      const refreshToken = typeof window !== 'undefined' 
        ? localStorage.getItem('refresh_token') 
        : null;
      
      return authClient.post<{ success: boolean; message: string }>('/api/v1/auth/logout', {
        refresh_token: refreshToken,
      });
    },
    onSuccess: () => {
      // Clear localStorage
      if (typeof window !== 'undefined') {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('user');
      }
      
      // Clear all cached data
      queryClient.clear();
      
      // Trigger auth change event
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new Event('authChange'));
      }
    },
    onError: () => {
      // Even if server logout fails, clear local data
      if (typeof window !== 'undefined') {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('user');
      }
      
      queryClient.clear();
      
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new Event('authChange'));
      }
    },
  });
}

// Refresh token mutation
export function useRefreshToken() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => {
      const refreshToken = typeof window !== 'undefined' 
        ? localStorage.getItem('refresh_token') 
        : null;
      
      if (!refreshToken) {
        throw new Error('No refresh token available');
      }
      
      return authClient.post<RefreshResponse>('/api/v1/auth/refresh', {
        refresh_token: refreshToken,
      });
    },
    onSuccess: (data) => {
      // Update tokens in localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('access_token', data.access_token);
        localStorage.setItem('refresh_token', data.refresh_token);
      }
    },
  });
}


