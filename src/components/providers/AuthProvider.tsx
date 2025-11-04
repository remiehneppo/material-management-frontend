"use client";

import { createContext, useContext, useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { authService } from '@/services';
import { apiClient } from '@/services/apiClient';

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

interface AuthProviderProps {
  children: React.ReactNode;
}

const publicRoutes = ['/login'];

export function AuthProvider({ children }: AuthProviderProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Set up unauthorized callback for apiClient
    apiClient.setUnauthorizedCallback(() => {
      console.log('Session expired - redirecting to login');
      setIsAuthenticated(false);
      
      // Show notification to user
      if (typeof window !== 'undefined') {
        // You can replace this with a toast notification library if available
        const message = 'Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.';
        
        // Try to use a toast if available, otherwise use alert
        if (window.alert) {
          window.alert(message);
        }
      }
      
      router.push('/login');
    });

    checkAuth();
  }, [router]);

  useEffect(() => {
    // Redirect logic - only run automatic redirects if not just logged in
    if (!isLoading) {
      const isPublicRoute = publicRoutes.includes(pathname);
      
      if (!isAuthenticated && !isPublicRoute) {
        // User is not authenticated and trying to access protected route
        router.push('/login');
      }
      // Remove automatic redirect from login to dashboard here
      // as it's now handled in the login function
    }
  }, [isAuthenticated, isLoading, pathname, router]);

  const checkAuth = async () => {
    try {
      const authenticated = authService.isAuthenticated();
      setIsAuthenticated(authenticated);
    } catch (error) {
      console.error('Auth check failed:', error);
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (username: string, password: string): Promise<boolean> => {
    try {
      const response = await authService.login({ username, password });
      if (response.status) {
        setIsAuthenticated(true);
        // Force immediate redirect to dashboard
        setTimeout(() => {
          router.push('/');
        }, 100); // Small delay to ensure state is updated
        return true;
      }
      return false;
    } catch (error) {
      console.error('Login failed:', error);
      return false;
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      setIsAuthenticated(false);
      router.push('/login');
    }
  };

  // Show loading spinner during auth check
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500"></div>
          <p className="mt-4 text-gray-600">Đang kiểm tra đăng nhập...</p>
        </div>
      </div>
    );
  }

  const value = {
    isAuthenticated,
    isLoading,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}