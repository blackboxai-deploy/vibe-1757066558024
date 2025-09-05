"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  id: string;
  email: string;
  name: string;
  isEmailVerified: boolean;
  has2FA: boolean;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<{ success: boolean; requires2FA?: boolean; message?: string }>;
  register: (name: string, email: string, password: string) => Promise<{ success: boolean; message?: string }>;
  logout: () => void;
  forgotPassword: (email: string) => Promise<{ success: boolean; message?: string }>;
  resetPassword: (token: string, newPassword: string) => Promise<{ success: boolean; message?: string }>;
  verify2FA: (code: string) => Promise<{ success: boolean; message?: string }>;
  setup2FA: () => Promise<{ success: boolean; qrCode?: string; backupCodes?: string[]; message?: string }>;
  verifyEmail: (token: string) => Promise<{ success: boolean; message?: string }>;
  resendVerification: () => Promise<{ success: boolean; message?: string }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    token: null,
    isLoading: true,
    isAuthenticated: false,
  });

  // API base URL
  const API_BASE_URL = typeof window !== 'undefined' && (window as any).env?.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000/api';

  useEffect(() => {
    // Check for stored token on app load
    checkStoredToken();
  }, []);

  const checkStoredToken = async () => {
    try {
      if (typeof window !== 'undefined') {
        const storedToken = localStorage.getItem('auth_token');
        if (storedToken) {
          // Simple token existence check without jwt-decode for now
          const userData = await fetchUserData(storedToken);
          if (userData) {
            setAuthState({
              user: userData,
              token: storedToken,
              isLoading: false,
              isAuthenticated: true,
            });
            return;
          }
          // Token invalid
          localStorage.removeItem('auth_token');
        }
      }
    } catch (error) {
      console.error('Error checking stored token:', error);
      if (typeof window !== 'undefined') {
        localStorage.removeItem('auth_token');
      }
    }
    
    setAuthState(prev => ({ ...prev, isLoading: false }));
  };

  const fetchUserData = async (token: string): Promise<User | null> => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/me`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      
      if (response.ok) {
        const userData = await response.json();
        return userData;
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
    return null;
  };

  const login = async (email: string, password: string) => {
    try {
      setAuthState(prev => ({ ...prev, isLoading: true }));
      
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        if (data.requires2FA) {
          setAuthState(prev => ({ ...prev, isLoading: false }));
          return { success: true, requires2FA: true, message: data.message };
        }

        localStorage.setItem('auth_token', data.token);
        setAuthState({
          user: data.user,
          token: data.token,
          isLoading: false,
          isAuthenticated: true,
        });

        return { success: true, message: 'Login successful' };
      } else {
        setAuthState(prev => ({ ...prev, isLoading: false }));
        return { success: false, message: data.message || 'Login failed' };
      }
    } catch (error) {
      setAuthState(prev => ({ ...prev, isLoading: false }));
      return { success: false, message: 'Network error. Please try again.' };
    }
  };

  const register = async (name: string, email: string, password: string) => {
    try {
      setAuthState(prev => ({ ...prev, isLoading: true }));
      
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();
      setAuthState(prev => ({ ...prev, isLoading: false }));

      return {
        success: response.ok,
        message: data.message || (response.ok ? 'Registration successful' : 'Registration failed')
      };
    } catch (error) {
      setAuthState(prev => ({ ...prev, isLoading: false }));
      return { success: false, message: 'Network error. Please try again.' };
    }
  };

  const logout = () => {
    localStorage.removeItem('auth_token');
    setAuthState({
      user: null,
      token: null,
      isLoading: false,
      isAuthenticated: false,
    });
  };

  const forgotPassword = async (email: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/forgot-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();
      return {
        success: response.ok,
        message: data.message || (response.ok ? 'Password reset email sent' : 'Failed to send reset email')
      };
    } catch (error) {
      return { success: false, message: 'Network error. Please try again.' };
    }
  };

  const resetPassword = async (token: string, newPassword: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/reset-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token, newPassword }),
      });

      const data = await response.json();
      return {
        success: response.ok,
        message: data.message || (response.ok ? 'Password reset successful' : 'Password reset failed')
      };
    } catch (error) {
      return { success: false, message: 'Network error. Please try again.' };
    }
  };

  const verify2FA = async (code: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/verify-2fa`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('auth_token', data.token);
        setAuthState({
          user: data.user,
          token: data.token,
          isLoading: false,
          isAuthenticated: true,
        });
      }

      return {
        success: response.ok,
        message: data.message || (response.ok ? '2FA verification successful' : '2FA verification failed')
      };
    } catch (error) {
      return { success: false, message: 'Network error. Please try again.' };
    }
  };

  const setup2FA = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/setup-2fa`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${authState.token}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      return {
        success: response.ok,
        qrCode: data.qrCode,
        backupCodes: data.backupCodes,
        message: data.message || (response.ok ? '2FA setup initiated' : '2FA setup failed')
      };
    } catch (error) {
      return { success: false, message: 'Network error. Please try again.' };
    }
  };

  const verifyEmail = async (token: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/verify-email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token }),
      });

      const data = await response.json();
      return {
        success: response.ok,
        message: data.message || (response.ok ? 'Email verified successfully' : 'Email verification failed')
      };
    } catch (error) {
      return { success: false, message: 'Network error. Please try again.' };
    }
  };

  const resendVerification = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/resend-verification`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${authState.token}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      return {
        success: response.ok,
        message: data.message || (response.ok ? 'Verification email sent' : 'Failed to send verification email')
      };
    } catch (error) {
      return { success: false, message: 'Network error. Please try again.' };
    }
  };

  const value: AuthContextType = {
    ...authState,
    login,
    register,
    logout,
    forgotPassword,
    resetPassword,
    verify2FA,
    setup2FA,
    verifyEmail,
    resendVerification,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};