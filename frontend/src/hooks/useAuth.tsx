import React, { createContext, useContext, useEffect, useState } from 'react';
import { authApi } from '../services/api';
import type { AdminUser } from '../types/portfolio';

interface AuthContextValue {
  admin: AdminUser | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [admin, setAdmin] = useState<AdminUser | null>(() => {
    const raw = localStorage.getItem('ob_admin_user');
    return raw ? JSON.parse(raw) : null;
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('ob_access_token');
    if (!token) {
      setLoading(false);
      return;
    }
    authApi
      .me()
      .then((user) => {
        setAdmin(user);
        localStorage.setItem('ob_admin_user', JSON.stringify(user));
      })
      .catch(() => {
        setAdmin(null);
        localStorage.removeItem('ob_access_token');
        localStorage.removeItem('ob_refresh_token');
        localStorage.removeItem('ob_admin_user');
      })
      .finally(() => setLoading(false));
  }, []);

  const login = async (email: string, password: string) => {
    const res = await authApi.login(email, password);
    localStorage.setItem('ob_access_token', res.access_token);
    localStorage.setItem('ob_refresh_token', res.refresh_token);
    localStorage.setItem('ob_admin_user', JSON.stringify(res.admin));
    setAdmin(res.admin);
  };

  const logout = async () => {
    const refresh = localStorage.getItem('ob_refresh_token') || undefined;
    await authApi.logout(refresh);
    localStorage.removeItem('ob_access_token');
    localStorage.removeItem('ob_refresh_token');
    localStorage.removeItem('ob_admin_user');
    setAdmin(null);
  };

  return <AuthContext.Provider value={{ admin, loading, login, logout }}>{children}</AuthContext.Provider>;
};

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}
