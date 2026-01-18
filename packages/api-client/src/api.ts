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
  UserPreferences,
  UpdatePreferencesRequest,
  UpdateProfileRequest,
  ToggleFeatureRequest,
  VerifyContactResult,
  VerifyPhoneRequest,
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
  User,
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

      sendVerification: (id: string) =>
        client.post<EmergencyContact>(`/api/v1/emergency-contacts/${id}/send-verification`),

      resendVerification: (id: string) =>
        client.post<EmergencyContact>(`/api/v1/emergency-contacts/${id}/resend-verification`),

      // Phone verification endpoints
      sendPhoneVerification: (id: string) =>
        client.post<SendPhoneVerificationResult>(`/api/v1/emergency-contacts/${id}/send-phone-verification`),

      verifyPhone: (id: string, data: VerifyPhoneRequest) =>
        client.post<VerifyPhoneResult>(`/api/v1/emergency-contacts/${id}/verify-phone`, data),

      resendPhoneVerification: (id: string) =>
        client.post<SendPhoneVerificationResult>(`/api/v1/emergency-contacts/${id}/resend-phone-verification`),

      // Linked contacts endpoints
      getLinkedContacts: () =>
        client.get<LinkedContact[]>("/api/v1/emergency-contacts/linked"),

      getPendingInvitations: () =>
        client.get<PendingContactInvitation[]>("/api/v1/emergency-contacts/linked/pending"),

      getContactLinkInvitation: (token: string) =>
        client.get<ContactLinkInvitationDetails>(`/api/v1/emergency-contacts/link/${token}`),

      acceptContactLink: (token: string) =>
        client.post<AcceptContactLinkResult>(`/api/v1/emergency-contacts/link/${token}/accept`),
    },

    // Public endpoint (no auth required)
    verification: {
      verifyContact: (token: string) =>
        client.get<VerifyContactResult>("/api/v1/verify-contact", { params: { token } }),
    },

    preferences: {
      get: () =>
        client.get<UserPreferences>("/api/v1/preferences"),

      update: (data: UpdatePreferencesRequest) =>
        client.patch<UserPreferences>("/api/v1/preferences", data),

      toggleFeature: (featureName: string, data: ToggleFeatureRequest) =>
        client.patch<UserPreferences>(`/api/v1/preferences/features/${featureName}`, data),

      completeOnboarding: () =>
        client.post<UserPreferences>("/api/v1/preferences/onboarding/complete"),

      getProfile: () =>
        client.get<User>("/api/v1/preferences/profile"),

      updateProfile: (data: UpdateProfileRequest) =>
        client.patch<User>("/api/v1/preferences/profile", data),
    },

    // OAuth endpoints
    oauth: {
      getProviders: () =>
        client.get<{ providers: ('google' | 'apple')[] }>("/api/auth/oauth/providers"),
    },

    // Caregiver endpoints
    caregiver: {
      // Get elders I'm caring for
      getElders: () =>
        client.get<ElderSummary[]>("/api/v1/caregiver/elders"),

      // Get elder detail
      getElderDetail: (elderId: string) =>
        client.get<ElderDetail>(`/api/v1/caregiver/elders/${elderId}`),

      // Get my caregivers
      getCaregivers: () =>
        client.get<CaregiverSummary[]>("/api/v1/caregiver/caregivers"),

      // Create invitation
      createInvitation: (data: CreateInvitationRequest) =>
        client.post<InvitationResponse>("/api/v1/caregiver/invitations", data),

      // Get invitation details (public)
      getInvitation: (token: string) =>
        client.get<InvitationDetails>(`/api/v1/caregiver/invitations/${token}`),

      // Accept invitation
      acceptInvitation: (token: string) =>
        client.post<{ message: string }>(`/api/v1/caregiver/invitations/${token}/accept`),

      // Check-in on behalf (caretaker only)
      checkInOnBehalf: (elderId: string, data?: CaretakerCheckInRequest) =>
        client.post<CaretakerCheckInResponse>(`/api/v1/caregiver/elders/${elderId}/check-in`, data ?? {}),

      // Add note
      addNote: (elderId: string, data: CreateNoteRequest) =>
        client.post<CaregiverNote>(`/api/v1/caregiver/elders/${elderId}/notes`, data),

      // Get notes
      getNotes: (elderId: string) =>
        client.get<CaregiverNote[]>(`/api/v1/caregiver/elders/${elderId}/notes`),
    },
  }
}

export type Api = ReturnType<typeof createApi>
