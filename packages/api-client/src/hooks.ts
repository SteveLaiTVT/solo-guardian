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
  UpdateProfileRequest,
  User,
  SendPhoneVerificationResult,
  VerifyPhoneResult,
  ElderSummary,
  ElderDetail,
  CaregiverSummary,
  CreateInvitationRequest,
  InvitationResponse,
  InvitationDetails,
  CaregiverNote,
  CreateNoteRequest,
  CaretakerCheckInRequest,
  CaretakerCheckInResponse,
  LinkedContact,
  PendingContactInvitation,
  ContactLinkInvitationDetails,
  AcceptContactLinkResult,
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

    // Phone verification hooks
    useSendPhoneVerification: () => {
      return useMutation({
        mutationFn: (contactId: string) =>
          api.contacts
            .sendPhoneVerification(contactId)
            .then((r: AxiosResponse<SendPhoneVerificationResult>) => r.data),
      })
    },

    useVerifyPhone: () => {
      const queryClient = useQueryClient()
      return useMutation({
        mutationFn: ({ contactId, otp }: { contactId: string; otp: string }) =>
          api.contacts
            .verifyPhone(contactId, { otp })
            .then((r: AxiosResponse<VerifyPhoneResult>) => r.data),
        onSuccess: () => {
          void queryClient.invalidateQueries({ queryKey: ["contacts"] })
        },
      })
    },

    useResendPhoneVerification: () => {
      return useMutation({
        mutationFn: (contactId: string) =>
          api.contacts
            .resendPhoneVerification(contactId)
            .then((r: AxiosResponse<SendPhoneVerificationResult>) => r.data),
      })
    },

    // Preferences hooks
    usePreferences: (options?: { enabled?: boolean }) =>
      useQuery({
        queryKey: ["preferences"],
        queryFn: () =>
          api.preferences.get().then((r: AxiosResponse<UserPreferences>) => r.data),
        enabled: options?.enabled ?? true,
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
        onSuccess: (data) => {
          // Immediately update cache with new data to prevent redirect loop
          queryClient.setQueryData(["preferences"], data)
        },
      })
    },

    // Profile hooks
    useProfile: () =>
      useQuery({
        queryKey: ["profile"],
        queryFn: () =>
          api.preferences.getProfile().then((r: AxiosResponse<User>) => r.data),
      }),

    useUpdateProfile: () => {
      const queryClient = useQueryClient()
      return useMutation({
        mutationFn: (data: UpdateProfileRequest) =>
          api.preferences.updateProfile(data).then((r: AxiosResponse<User>) => r.data),
        onSuccess: () => {
          void queryClient.invalidateQueries({ queryKey: ["profile"] })
        },
      })
    },

    // OAuth hooks
    useOAuthProviders: () =>
      useQuery({
        queryKey: ["oauth", "providers"],
        queryFn: () =>
          api.oauth.getProviders().then((r: AxiosResponse<{ providers: ('google' | 'apple')[] }>) => r.data),
      }),

    // Caregiver hooks
    useElders: () =>
      useQuery({
        queryKey: ["caregiver", "elders"],
        queryFn: () =>
          api.caregiver.getElders().then((r: AxiosResponse<ElderSummary[]>) => r.data),
      }),

    useElderDetail: (elderId: string) =>
      useQuery({
        queryKey: ["caregiver", "elders", elderId],
        queryFn: () =>
          api.caregiver.getElderDetail(elderId).then((r: AxiosResponse<ElderDetail>) => r.data),
        enabled: !!elderId,
      }),

    useCaregivers: () =>
      useQuery({
        queryKey: ["caregiver", "caregivers"],
        queryFn: () =>
          api.caregiver.getCaregivers().then((r: AxiosResponse<CaregiverSummary[]>) => r.data),
      }),

    useCreateInvitation: () => {
      return useMutation({
        mutationFn: (data: CreateInvitationRequest) =>
          api.caregiver.createInvitation(data).then((r: AxiosResponse<InvitationResponse>) => r.data),
      })
    },

    useInvitation: (token: string) =>
      useQuery({
        queryKey: ["caregiver", "invitations", token],
        queryFn: () =>
          api.caregiver.getInvitation(token).then((r: AxiosResponse<InvitationDetails>) => r.data),
        enabled: !!token,
      }),

    useAcceptInvitation: () => {
      const queryClient = useQueryClient()
      return useMutation({
        mutationFn: (token: string) =>
          api.caregiver.acceptInvitation(token).then((r: AxiosResponse<{ message: string }>) => r.data),
        onSuccess: () => {
          void queryClient.invalidateQueries({ queryKey: ["caregiver"] })
        },
      })
    },

    useCheckInOnBehalf: () => {
      const queryClient = useQueryClient()
      return useMutation({
        mutationFn: ({ elderId, data }: { elderId: string; data?: CaretakerCheckInRequest }) =>
          api.caregiver.checkInOnBehalf(elderId, data).then((r: AxiosResponse<CaretakerCheckInResponse>) => r.data),
        onSuccess: () => {
          void queryClient.invalidateQueries({ queryKey: ["caregiver", "elders"] })
        },
      })
    },

    useAddNote: () => {
      const queryClient = useQueryClient()
      return useMutation({
        mutationFn: ({ elderId, data }: { elderId: string; data: CreateNoteRequest }) =>
          api.caregiver.addNote(elderId, data).then((r: AxiosResponse<CaregiverNote>) => r.data),
        onSuccess: (_data, variables) => {
          void queryClient.invalidateQueries({ queryKey: ["caregiver", "elders", variables.elderId, "notes"] })
        },
      })
    },

    useElderNotes: (elderId: string) =>
      useQuery({
        queryKey: ["caregiver", "elders", elderId, "notes"],
        queryFn: () =>
          api.caregiver.getNotes(elderId).then((r: AxiosResponse<CaregiverNote[]>) => r.data),
        enabled: !!elderId,
      }),

    // Linked Contacts hooks
    useLinkedContacts: () =>
      useQuery({
        queryKey: ["contacts", "linked"],
        queryFn: () =>
          api.contacts.getLinkedContacts().then((r: AxiosResponse<LinkedContact[]>) => r.data),
      }),

    usePendingContactInvitations: () =>
      useQuery({
        queryKey: ["contacts", "linked", "pending"],
        queryFn: () =>
          api.contacts.getPendingInvitations().then((r: AxiosResponse<PendingContactInvitation[]>) => r.data),
      }),

    useContactLinkInvitation: (token: string) =>
      useQuery({
        queryKey: ["contacts", "link", token],
        queryFn: () =>
          api.contacts.getContactLinkInvitation(token).then((r: AxiosResponse<ContactLinkInvitationDetails>) => r.data),
        enabled: !!token,
      }),

    useAcceptContactLink: () => {
      const queryClient = useQueryClient()
      return useMutation({
        mutationFn: (token: string) =>
          api.contacts.acceptContactLink(token).then((r: AxiosResponse<AcceptContactLinkResult>) => r.data),
        onSuccess: () => {
          void queryClient.invalidateQueries({ queryKey: ["contacts", "linked"] })
        },
      })
    },
  }
}

export type ApiHooks = ReturnType<typeof createHooks>
