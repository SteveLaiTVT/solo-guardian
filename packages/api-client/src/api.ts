import type { AxiosInstance } from "axios"
import type {
  AuthResult,
  LoginRequest,
  RegisterRequest,
  CheckIn,
  CreateCheckInRequest,
  TodayStatus,
  CheckInHistory,
  CheckInSettings,
  UpdateSettingsRequest,
  EmergencyContact,
  CreateContactRequest,
  UpdateContactRequest,
  ReorderContactsRequest,
} from "./types"

export function createApi(client: AxiosInstance) {
  return {
    auth: {
      login: (data: LoginRequest) =>
        client.post<AuthResult>("/api/v1/auth/login", data),

      register: (data: RegisterRequest) =>
        client.post<AuthResult>("/api/v1/auth/register", data),

      refresh: (refreshToken: string) =>
        client.post<AuthResult>("/api/v1/auth/refresh", { refreshToken }),

      logout: (refreshToken: string) =>
        client.post("/api/v1/auth/logout", { refreshToken }),
    },

    checkIn: {
      create: (data?: CreateCheckInRequest) =>
        client.post<CheckIn>("/api/v1/check-ins", data ?? {}),

      getToday: () => client.get<TodayStatus>("/api/v1/check-ins/today"),

      getHistory: (page = 1, pageSize = 30) =>
        client.get<CheckInHistory>("/api/v1/check-ins", {
          params: { page, pageSize },
        }),
    },

    settings: {
      get: () => client.get<CheckInSettings>("/api/v1/check-in-settings"),

      update: (data: UpdateSettingsRequest) =>
        client.put<CheckInSettings>("/api/v1/check-in-settings", data),
    },

    contacts: {
      getAll: () =>
        client.get<EmergencyContact[]>("/api/v1/emergency-contacts"),

      getOne: (id: string) =>
        client.get<EmergencyContact>(`/api/v1/emergency-contacts/${id}`),

      create: (data: CreateContactRequest) =>
        client.post<EmergencyContact>("/api/v1/emergency-contacts", data),

      update: (id: string, data: UpdateContactRequest) =>
        client.put<EmergencyContact>(`/api/v1/emergency-contacts/${id}`, data),

      delete: (id: string) =>
        client.delete(`/api/v1/emergency-contacts/${id}`),

      reorder: (data: ReorderContactsRequest) =>
        client.put<EmergencyContact[]>("/api/v1/emergency-contacts/reorder", data),
    },
  }
}

export type Api = ReturnType<typeof createApi>
