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
  }
}

export type ApiHooks = ReturnType<typeof createHooks>
