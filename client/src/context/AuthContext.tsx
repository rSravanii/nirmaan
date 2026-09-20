import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole } from '../types/index.js';
import { apiRequest } from '../api/client.js';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; message?: string }>;
  logout: () => void;
  switchDemoRole: (role: 'CITIZEN' | 'STUDENT' | 'PROFESSOR' | 'RESEARCHER' | 'COMPANY' | 'EVALUATOR' | 'ADMIN') => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('gramutthan_token'));
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const refreshUser = async () => {
    const storedToken = localStorage.getItem('gramutthan_token');
    if (!storedToken) {
      setUser(null);
      setIsLoading(false);
      return;
    }

    try {
      const res = await apiRequest('/auth/me');
      if (res.success && res.user) {
        setUser(res.user);
      } else {
        localStorage.removeItem('gramutthan_token');
        setToken(null);
        setUser(null);
      }
    } catch (e) {
      console.warn('Failed to fetch current user profile:', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refreshUser();
  }, [token]);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    const res = await apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });

    if (res.success && res.token && res.user) {
      localStorage.setItem('gramutthan_token', res.token);
      setToken(res.token);
      setUser(res.user);
      setIsLoading(false);
      return { success: true };
    } else {
      setIsLoading(false);
      return { success: false, message: res.message || 'Login failed' };
    }
  };

  const switchDemoRole = async (role: 'CITIZEN' | 'STUDENT' | 'PROFESSOR' | 'RESEARCHER' | 'COMPANY' | 'EVALUATOR' | 'ADMIN') => {
    setIsLoading(true);
    try {
      const res = await apiRequest('/auth/demo-login', {
        method: 'POST',
        body: JSON.stringify({ role })
      });

      if (res.success && res.token && res.user) {
        localStorage.setItem('gramutthan_token', res.token);
        setToken(res.token);
        setUser(res.user);
      }
    } catch (err) {
      console.error('Failed to switch demo role:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('gramutthan_token');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: Boolean(user),
        isLoading,
        login,
        logout,
        switchDemoRole,
        refreshUser
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
