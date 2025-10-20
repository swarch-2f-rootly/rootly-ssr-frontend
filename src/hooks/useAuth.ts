import { useState, useEffect } from 'react';

interface User {
  id: string;
  email: string;
  name?: string;
  first_name?: string;
  last_name?: string;
  profile_photo_url?: string;
  is_active?: boolean;
  roles?: string[];
  created_at?: string;
}

interface LoginCredentials {
  email: string;
  password: string;
}

interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
}

export function useAuth(): AuthState {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate auth check
    const checkAuth = async () => {
      try {
        // In a real app, this would check for a valid session/token
        const savedUser = localStorage.getItem('user');
        if (savedUser) {
          setUser(JSON.parse(savedUser));
        }
      } catch (error) {
        console.error('Auth check failed:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (credentials: LoginCredentials): Promise<void> => {
    try {
      // Use Next.js API route as proxy to avoid CORS issues
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      if (!response.ok) {
        const errText = await response.text();
        throw new Error(`Login failed: ${response.status} ${errText}`);
      }

      const data = await response.json();
      // Normalize gateway response
      const gatewayUser = data.user;
      const accessToken = data.access_token ?? data.token;

      setUser(gatewayUser);
      localStorage.setItem('user', JSON.stringify(gatewayUser));
      if (accessToken) {
        localStorage.setItem('access_token', accessToken);
      }
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('access_token');
  };

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    logout
  };
}