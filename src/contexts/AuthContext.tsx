import React, { createContext, useContext, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
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
  const [hasToken, setHasToken] = useState(!!localStorage.getItem('access_token'));
  const logoutMutation = useLogout();
  
  // Check for token changes (reactive to localStorage)
  useEffect(() => {
    const checkToken = () => {
      const token = localStorage.getItem('access_token');
      setHasToken(!!token);
    };
    
    // Check immediately
    checkToken();
    
    // Listen for storage events (for cross-tab updates)
    window.addEventListener('storage', checkToken);
    
    // Custom event for same-tab updates
    window.addEventListener('auth-change', checkToken);
    
    return () => {
      window.removeEventListener('storage', checkToken);
      window.removeEventListener('auth-change', checkToken);
    };
  }, []);
  
  // Fetch current user data if there's a token
  const { data: user, isLoading, error } = useCurrentUser();

  // Initialize authentication state
  useEffect(() => {
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
    
    // Update state immediately
    setIsAuthenticated(false);
    setHasToken(false);
    setIsInitialized(true);
    
    // Trigger auth change event
    window.dispatchEvent(new Event('auth-change'));
    
    // Show logout success message immediately
    toast.success('Logged out successfully.');
    
    // Attempt to notify backend (don't block on this)
    if (refreshToken && !logoutMutation.isPending) {
      logoutMutation.mutate(undefined, {
        onSuccess: () => {
          // Backend logout successful - already showed success message
        },
        onError: () => {
          // Backend logout failed, but local logout succeeded
          // Don't show error since user is already logged out locally
        }
      });
    }
    // Don't redirect here - let the root component handle navigation
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
