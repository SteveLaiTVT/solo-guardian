import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import type { AxiosInstance, AxiosResponse } from "axios"
import { createApi } from "./api"
import type {
  LoginRequest,
  RegisterRequest,
  CreateCheckInRequest,
  UpdateSettingsRequest,
  TodayStatus,
  CheckInHistory,
  CheckIn,
  CheckInSettings,
  AuthResult,
  EmergencyContact,
  CreateContactRequest,
  UpdateContactRequest,
  ReorderContactsRequest,
  UserPreferences,
  UpdatePreferencesRequest,
} from "./types"

export function createHooks(client: AxiosInstance) {
  const api = createApi(client)

  return {
    // Check-in hooks
    useCheckInToday: () =>
      useQuery({
        queryKey: ["checkIn", "today"],
        queryFn: () =>
          api.checkIn.getToday().then((r: AxiosResponse<TodayStatus>) => r.data),
      }),

    useCheckInHistory: (page: number, pageSize: number) =>
      useQuery({
        queryKey: ["checkIn", "history", page, pageSize],
        queryFn: () =>
          api.checkIn
            .getHistory(page, pageSize)
            .then((r: AxiosResponse<CheckInHistory>) => r.data),
      }),

    useCreateCheckIn: () => {
      const queryClient = useQueryClient()
      return useMutation({
        mutationFn: (data?: CreateCheckInRequest) =>
          api.checkIn.create(data).then((r: AxiosResponse<CheckIn>) => r.data),
        onSuccess: () => {
          void queryClient.invalidateQueries({ queryKey: ["checkIn"] })
        },
      })
    },

    // Settings hooks
    useSettings: () =>
      useQuery({
        queryKey: ["settings"],
        queryFn: () =>
          api.settings.get().then((r: AxiosResponse<CheckInSettings>) => r.data),
      }),

    useUpdateSettings: () => {
      const queryClient = useQueryClient()
      return useMutation({
        mutationFn: (data: UpdateSettingsRequest) =>
          api.settings
            .update(data)
            .then((r: AxiosResponse<CheckInSettings>) => r.data),
        onSuccess: () => {
          void queryClient.invalidateQueries({ queryKey: ["settings"] })
        },
      })
    },

    // Auth hooks
    useLogin: () =>
      useMutation({
        mutationFn: (data: LoginRequest) =>
          api.auth.login(data).then((r: AxiosResponse<AuthResult>) => r.data),
      }),

    useRegister: () =>
      useMutation({
        mutationFn: (data: RegisterRequest) =>
          api.auth.register(data).then((r: AxiosResponse<AuthResult>) => r.data),
      }),

    // Emergency Contacts hooks
    useContacts: () =>
      useQuery({
        queryKey: ["contacts"],
        queryFn: () =>
          api.contacts.getAll().then((r: AxiosResponse<EmergencyContact[]>) => r.data),
      }),

    useCreateContact: () => {
      const queryClient = useQueryClient()
      return useMutation({
        mutationFn: (data: CreateContactRequest) =>
          api.contacts.create(data).then((r: AxiosResponse<EmergencyContact>) => r.data),
        onSuccess: () => {
          void queryClient.invalidateQueries({ queryKey: ["contacts"] })
        },
      })
    },

    useUpdateContact: () => {
      const queryClient = useQueryClient()
      return useMutation({
        mutationFn: ({ id, data }: { id: string; data: UpdateContactRequest }) =>
          api.contacts.update(id, data).then((r: AxiosResponse<EmergencyContact>) => r.data),
        onSuccess: () => {
          void queryClient.invalidateQueries({ queryKey: ["contacts"] })
        },
      })
    },

    useDeleteContact: () => {
      const queryClient = useQueryClient()
      return useMutation({
        mutationFn: (id: string) => api.contacts.delete(id),
        onSuccess: () => {
          void queryClient.invalidateQueries({ queryKey: ["contacts"] })
        },
      })
    },

    useReorderContacts: () => {
      const queryClient = useQueryClient()
      return useMutation({
        mutationFn: (data: ReorderContactsRequest) =>
          api.contacts.reorder(data).then((r: AxiosResponse<EmergencyContact[]>) => r.data),
        onSuccess: () => {
          void queryClient.invalidateQueries({ queryKey: ["contacts"] })
        },
      })
    },

    // Preferences hooks
    usePreferences: () =>
      useQuery({
        queryKey: ["preferences"],
        queryFn: () =>
          api.preferences.get().then((r: AxiosResponse<UserPreferences>) => r.data),
      }),

    useUpdatePreferences: () => {
      const queryClient = useQueryClient()
      return useMutation({
        mutationFn: (data: UpdatePreferencesRequest) =>
          api.preferences.update(data).then((r: AxiosResponse<UserPreferences>) => r.data),
        onSuccess: () => {
          void queryClient.invalidateQueries({ queryKey: ["preferences"] })
        },
      })
    },

    useToggleFeature: () => {
      const queryClient = useQueryClient()
      return useMutation({
        mutationFn: ({ featureName, enabled }: { featureName: string; enabled: boolean }) =>
          api.preferences
            .toggleFeature(featureName, { enabled })
            .then((r: AxiosResponse<UserPreferences>) => r.data),
        onSuccess: () => {
          void queryClient.invalidateQueries({ queryKey: ["preferences"] })
        },
      })
    },

    useCompleteOnboarding: () => {
      const queryClient = useQueryClient()
      return useMutation({
        mutationFn: () =>
          api.preferences.completeOnboarding().then((r: AxiosResponse<UserPreferences>) => r.data),
        onSuccess: () => {
          void queryClient.invalidateQueries({ queryKey: ["preferences"] })
        },
      })
    },
  }
}

export type ApiHooks = ReturnType<typeof createHooks>
