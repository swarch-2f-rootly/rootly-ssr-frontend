"use client";

import { useEffect, useState } from 'react';

export interface User {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  full_name: string;
  profile_photo_url: string | null;
  is_active: boolean;
  roles: string[];
  created_at: string;
  updated_at: string;
}

export const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = () => {
    try {
      const accessToken = localStorage.getItem('access_token');
      const userData = localStorage.getItem('user');

      if (accessToken && userData) {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
        setIsAuthenticated(true);
      } else {
        setUser(null);
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.error('Error checking auth status:', error);
      // If there's an error parsing, clear the data
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('user');
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  };

  const login = (tokenData: any) => {
    localStorage.setItem('access_token', tokenData.access_token);
    localStorage.setItem('refresh_token', tokenData.refresh_token);
    localStorage.setItem('user', JSON.stringify(tokenData.user));
    setUser(tokenData.user);
    setIsAuthenticated(true);
    // Dispatch custom event for components that need to react to auth changes
    window.dispatchEvent(new Event('authChange'));
  };

  const logout = async () => {
    const refreshToken = localStorage.getItem('refresh_token');

    // Always clear local storage first for immediate UI update
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user');
    setUser(null);
    setIsAuthenticated(false);
    window.dispatchEvent(new Event('authChange'));

    // If we have a refresh token, try to revoke it on the server
    if (refreshToken) {
      try {
        // TODO: Replace with actual API URL when backend is ready
        await fetch('/api/auth/logout', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ refresh_token: refreshToken }),
        });
      } catch (error) {
        // Server logout failed, but local logout is complete
        console.warn('Server logout failed, but local logout was successful:', error);
      }
    }
  };

  const getAccessToken = () => {
    return localStorage.getItem('access_token');
  };

  const getRefreshToken = () => {
    return localStorage.getItem('refresh_token');
  };

  return {
    isAuthenticated,
    user,
    isLoading,
    login,
    logout,
    getAccessToken,
    getRefreshToken,
    checkAuthStatus,
  };
};
