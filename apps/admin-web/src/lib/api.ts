/**
 * @file api.ts
 * @description Admin API client configuration
 * @task TASK-046
 * @design_state_version 3.7.0
 */
import axios from 'axios';
import { useAdminAuthStore } from '@/stores/auth.store';

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api/v1';

export const adminApi = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
adminApi.interceptors.request.use((config) => {
  const { accessToken } = useAdminAuthStore.getState();
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

// Response interceptor for token refresh
adminApi.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const { refreshToken, setTokens, clearAuth } = useAdminAuthStore.getState();

      if (refreshToken) {
        try {
          const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {
            refreshToken,
          });
          const { accessToken: newAccessToken, refreshToken: newRefreshToken } = response.data.data;
          setTokens(newAccessToken, newRefreshToken);
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          return adminApi(originalRequest);
        } catch {
          clearAuth();
        }
      }
    }
    return Promise.reject(error);
  }
);

// Admin-specific API endpoints
export const adminApiEndpoints = {
  // Dashboard stats
  getDashboardStats: (): Promise<{ data: DashboardStats }> =>
    adminApi.get('/admin/dashboard/stats'),

  // User management
  getUsers: (params: UserListParams): Promise<{ data: UserListResponse }> =>
    adminApi.get('/admin/users', { params }),

  getUser: (id: string): Promise<{ data: UserDetail }> =>
    adminApi.get(`/admin/users/${id}`),

  updateUserStatus: (id: string, status: UserStatus): Promise<void> =>
    adminApi.patch(`/admin/users/${id}/status`, { status }),

  // Alert management
  getAlerts: (params: AlertListParams): Promise<{ data: AlertListResponse }> =>
    adminApi.get('/admin/alerts', { params }),
};

// Types
export interface DashboardStats {
  totalUsers: number;
  activeUsers: number;
  todayCheckIns: number;
  pendingAlerts: number;
  userGrowth: number[];
  checkInRate: number;
}

export interface UserListParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
}

export interface UserListResponse {
  users: UserSummary[];
  total: number;
  page: number;
  limit: number;
}

export interface UserSummary {
  id: string;
  email: string;
  name: string;
  status: UserStatus;
  lastCheckIn: string | null;
  createdAt: string;
}

export interface UserDetail extends UserSummary {
  checkInSettings: {
    deadlineTime: string;
    reminderTime: string;
    timezone: string;
  } | null;
  emergencyContactsCount: number;
  totalCheckIns: number;
  alertsCount: number;
}

export type UserStatus = 'active' | 'suspended' | 'deleted';

export interface AlertListParams {
  page?: number;
  limit?: number;
  status?: string;
}

export interface AlertListResponse {
  alerts: AlertSummary[];
  total: number;
  page: number;
  limit: number;
}

export interface AlertSummary {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  status: string;
  triggeredAt: string;
  resolvedAt: string | null;
}
