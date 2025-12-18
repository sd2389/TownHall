"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  role: 'citizen' | 'business' | 'government' | 'superuser';
  phoneNumber: string;
  is_superuser?: boolean;
  [key: string]: any; // For role-specific data
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string, userType: string) => Promise<boolean>;
  signup: (data: any) => Promise<{ success: boolean; error?: string; details?: any }>;
  logout: () => void;
  isLoading: boolean;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for stored token on mount (client-side only)
    if (typeof window !== 'undefined') {
      const storedToken = localStorage.getItem('auth_token');
      if (storedToken) {
        setToken(storedToken);
        fetchUserProfile(storedToken);
      } else {
        setIsLoading(false);
      }
    } else {
      setIsLoading(false);
    }
  }, []);

  const fetchUserProfile = async (authToken: string) => {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
      
      const response = await fetch(`${API_BASE_URL}/auth/users/me/`, {
        method: 'GET',
        headers: {
          'Authorization': `Token ${authToken}`,
          'Content-Type': 'application/json',
        },
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
      } else if (response.status === 401 || response.status === 403) {
        // Token is invalid, clear it
        localStorage.removeItem('auth_token');
        setToken(null);
        setUser(null);
      } else {
        // Other error status codes
        console.error(`Failed to fetch user profile: ${response.status} ${response.statusText}`);
      }
    } catch (error) {
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          console.error('Request timeout when fetching user profile');
        } else if (error.message === 'Failed to fetch' || error.message.includes('fetch')) {
          // Network error - backend might not be running
          console.error(`Network error: Cannot connect to backend at ${API_BASE_URL}. Please ensure the Django server is running.`);
        } else {
          console.error('Error fetching user profile:', error.message);
        }
      } else {
        console.error('Unknown error fetching user profile:', error);
      }
      // Don't clear token on network errors, only on auth errors
      // This allows the user to retry when the backend comes back online
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string, userType: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      const response = await fetch(`${API_BASE_URL}/auth/login/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
          userType,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setToken(data.token);
        setUser(data.user);
        localStorage.setItem('auth_token', data.token);
        return true;
      } else {
        console.error('Login error:', data.error);
        return false;
      }
    } catch (error) {
      console.error('Login error:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (data: any): Promise<{ success: boolean; error?: string; details?: any }> => {
    try {
      setIsLoading(true);
      const response = await fetch(`${API_BASE_URL}/auth/signup/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const responseData = await response.json();

      if (response.ok) {
        setToken(responseData.token);
        setUser(responseData.user);
        localStorage.setItem('auth_token', responseData.token);
        return { success: true };
      } else {
        // Log full error details for debugging
        console.error('Signup error:', responseData.error);
        console.error('Validation details:', responseData.details);
        
        return {
          success: false,
          error: responseData.error || 'Validation failed',
          details: responseData.details
        };
      }
    } catch (error: any) {
      console.error('Signup error:', error);
      return {
        success: false,
        error: error.message || 'Network error. Please try again.'
      };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    try {
      if (token) {
        fetch(`${API_BASE_URL}/auth/logout/`, {
          method: 'POST',
          headers: {
            'Authorization': `Token ${token}`,
            'Content-Type': 'application/json',
          },
        }).catch(error => console.error('Logout error:', error));
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setUser(null);
      setToken(null);
      localStorage.removeItem('auth_token');
    }
  };

  const value: AuthContextType = {
    user,
    token,
    login,
    signup,
    logout,
    isLoading,
    isAuthenticated: !!user && !!token,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
