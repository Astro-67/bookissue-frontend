import React, { createContext, useContext, useEffect, useState } from 'react';
import { useCurrentUser, useLogout } from '../hooks/api';
import type { User } from '../types/api';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const logoutMutation = useLogout();
  
  // Check if there's a token in localStorage
  const hasToken = !!localStorage.getItem('access_token');
  
  // Fetch current user data if there's a token
  const { data: user, isLoading, error } = useCurrentUser();

  // Initialize authentication state
  useEffect(() => {
    console.log('Auth initialization:', { hasToken, user, isLoading, error });
    
    if (!hasToken) {
      // No token, definitely not authenticated
      setIsAuthenticated(false);
      setIsInitialized(true);
    } else if (user) {
      // Has token and user data, authenticated
      setIsAuthenticated(true);
      setIsInitialized(true);
    } else if (error) {
      // Has token but API call failed, clear auth
      console.log('Auth error:', error);
      handleLogout();
    }
    // If hasToken but still loading user data, wait...
  }, [hasToken, user, error, isLoading]);

  // Clear auth if token exists but user fetch fails with 401
  useEffect(() => {
    if (hasToken && error && (error as any)?.response?.status === 401) {
      handleLogout();
    }
  }, [error, hasToken]);

  const handleLogout = () => {
    // Get refresh token before clearing it
    const refreshToken = localStorage.getItem('refresh_token');
    
    // Clear tokens immediately for UI responsiveness
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    setIsAuthenticated(false);
    setIsInitialized(true);
    
    // Attempt to notify backend (don't block on this)
    if (refreshToken && !logoutMutation.isPending) {
      logoutMutation.mutate(undefined, {
        onSettled: () => {
          // Redirect to login after backend call completes (success or failure)
          window.location.href = '/login';
        }
      });
    } else {
      // Redirect immediately if no refresh token
      window.location.href = '/login';
    }
  };

  const value: AuthContextType = {
    user: user || null,
    isAuthenticated,
    isLoading: !isInitialized || (isAuthenticated && isLoading),
    logout: handleLogout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
