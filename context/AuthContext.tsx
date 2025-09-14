import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { apiService } from '@/services/api';

interface User {
  id: string;
  business_name: string;
  email: string;
  whatsapp_connected: boolean;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string; user?: User }>;
  signup: (businessName: string, email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  connectWhatsApp: () => Promise<{ success: boolean; error?: string }>;
  disconnectWhatsapp: () => Promise<void>;
  whatsappConnected: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing token on app start
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const token = await apiService.getStoredToken();
      if (token) {
        const response = await apiService.getCurrentUser();
        if (response.success) {
          setUser(response.user);
        }
      }
    } catch (error) {
      console.error('Auth check failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const response = await apiService.login(email, password);
      if (response.success) {
        setUser(response.user);
        return { success: true, user: response.user };
      } else {
        return { success: false, error: response.error };
      }
    } catch (error) {
      return { success: false, error: 'Login failed' };
    }
  };

  const signup = async (businessName: string, email: string, password: string) => {
    try {
      const response = await apiService.signup(businessName, email, password);
      if (response.success) {
        setUser(response.user);
        return { success: true };
      } else {
        return { success: false, error: response.error };
      }
    } catch (error) {
      return { success: false, error: 'Signup failed' };
    }
  };

  const logout = async () => {
    try {
      await apiService.logout();
      setUser(null);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const connectWhatsApp = async () => {
    try {
      const response = await apiService.connectWhatsApp();
      if (response.success) {
        setUser(prev => prev ? { ...prev, whatsapp_connected: true } : null);
        return { success: true };
      } else {
        return { success: false, error: response.error };
      }
    } catch (error) {
      return { success: false, error: 'WhatsApp connection failed' };
    }
  };

  const disconnectWhatsapp = async () => {
    try {
      await apiService.disconnectWhatsApp();
      setUser(prev => prev ? { ...prev, whatsapp_connected: false } : null);
    } catch (error) {
      console.error('WhatsApp disconnect error:', error);
    }
  };

  const value: AuthContextType = {
    user,
    loading,
    login,
    signup,
    logout,
    connectWhatsApp,
    disconnectWhatsapp,
    whatsappConnected: user?.whatsapp_connected || false,
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