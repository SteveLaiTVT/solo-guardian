/**
 * @file auth.store.ts
 * @description Admin authentication state management
 * @task TASK-046
 * @design_state_version 3.7.0
 */
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'super_admin';
}

interface AdminAuthState {
  accessToken: string | null;
  refreshToken: string | null;
  user: AdminUser | null;
  isAuthenticated: boolean;
  setTokens: (accessToken: string, refreshToken: string) => void;
  setUser: (user: AdminUser) => void;
  clearAuth: () => void;
}

export const useAdminAuthStore = create<AdminAuthState>()(
  persist(
    (set) => ({
      accessToken: null,
      refreshToken: null,
      user: null,
      isAuthenticated: false,
      setTokens: (accessToken: string, refreshToken: string): void => {
        set({ accessToken, refreshToken, isAuthenticated: true });
      },
      setUser: (user: AdminUser): void => {
        set({ user });
      },
      clearAuth: (): void => {
        set({
          accessToken: null,
          refreshToken: null,
          user: null,
          isAuthenticated: false,
        });
      },
    }),
    {
      name: 'admin-auth-storage',
    }
  )
);
