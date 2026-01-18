// User types
export interface User {
  id: string
  email: string | null
  username: string | null
  phone: string | null
  avatar: string | null
  name: string
  birthYear: number | null
  createdAt: string
}

// Auth types
export interface AuthTokens {
  accessToken: string
  refreshToken: string
  expiresIn: number
}

export interface AuthResult {
  user: User
  tokens: AuthTokens
}

export interface LoginRequest {
  identifier: string
  password: string
}

export interface RegisterRequest {
  name: string
  password: string
  username?: string
  email?: string
  phone?: string
}

export interface RefreshRequest {
  refreshToken: string
}

// Check-in types
export interface CheckIn {
  id: string
  userId: string
  checkInDate: string
  checkedInAt: string
  note: string | null
}

export interface CreateCheckInRequest {
  note?: string
}

export interface TodayStatus {
  hasCheckedIn: boolean
  checkIn: CheckIn | null
  deadlineTime: string
  isOverdue: boolean
}

export interface CheckInHistory {
  checkIns: CheckIn[]
  total: number
  page: number
  pageSize: number
}

// Settings types
export interface CheckInSettings {
  userId: string
  deadlineTime: string
  reminderTime: string
  reminderEnabled: boolean
  timezone: string
  createdAt: string
  updatedAt: string
}

export interface UpdateSettingsRequest {
  deadlineTime?: string
  reminderTime?: string
  reminderEnabled?: boolean
}

// Notification channel type
export type NotificationChannel = 'email' | 'sms'

// Invitation status type
export type InvitationStatus = 'none' | 'pending' | 'accepted'

// Emergency Contact types
export interface EmergencyContact {
  id: string
  userId: string
  name: string
  email: string
  phone: string | null
  priority: number
  isVerified: boolean
  phoneVerified: boolean
  preferredChannel: NotificationChannel
  isActive: boolean
  linkedUserId: string | null
  linkedUserName: string | null
  invitationStatus: InvitationStatus
  createdAt: string
  updatedAt: string
}

export interface CreateContactRequest {
  name: string
  email: string
  phone?: string
  priority?: number
  preferredChannel?: NotificationChannel
}

export interface UpdateContactRequest {
  name?: string
  email?: string
  phone?: string
  priority?: number
  isActive?: boolean
  preferredChannel?: NotificationChannel
}

export interface ReorderContactsRequest {
  contactIds: string[]
}

// Theme type
export type ThemeType = 'standard' | 'warm' | 'nature' | 'ocean'

// User Preferences types
export interface UserPreferences {
  id: string
  userId: string
  preferFeaturesOn: boolean
  theme: ThemeType
  fontSize: number
  highContrast: boolean
  reducedMotion: boolean
  warmColors: boolean
  hobbyCheckIn: boolean
  familyAccess: boolean
  optionalFeatures: Record<string, boolean>
  onboardingCompleted: boolean
  createdAt: string
  updatedAt: string
}

export interface UpdatePreferencesRequest {
  preferFeaturesOn?: boolean
  theme?: ThemeType
  fontSize?: number
  highContrast?: boolean
  reducedMotion?: boolean
  warmColors?: boolean
  hobbyCheckIn?: boolean
  familyAccess?: boolean
}

export interface UpdateProfileRequest {
  name?: string
  birthYear?: number | null
}

export interface ToggleFeatureRequest {
  enabled: boolean
}

// Contact Verification types
export interface VerifyContactResult {
  success: boolean
  contactName: string
  userName: string
}

// Phone Verification types
export interface VerifyPhoneRequest {
  otp: string
}

export interface SendPhoneVerificationResult {
  message: string
  expiresAt: string
}

export interface VerifyPhoneResult {
  success: boolean
  message: string
}

// Caregiver types
export type RelationshipType = 'caregiver' | 'family' | 'caretaker'

export interface ElderSummary {
  id: string
  name: string
  email: string
  lastCheckIn: string | null
  todayStatus: 'checked_in' | 'pending' | 'overdue'
  isAccepted: boolean
}

export interface CaregiverSummary {
  id: string
  name: string
  email: string
  isAccepted: boolean
}

export interface ElderDetail extends ElderSummary {
  checkInSettings: {
    deadlineTime: string
    reminderTime: string
    timezone: string
  } | null
  pendingAlerts: number
  emergencyContacts: Array<{
    id: string
    name: string
    isVerified: boolean
  }>
}

export interface CreateInvitationRequest {
  relationshipType: RelationshipType
  targetEmail?: string
  targetPhone?: string
}

export interface InvitationResponse {
  id: string
  token: string
  relationshipType: RelationshipType
  targetEmail: string | null
  targetPhone: string | null
  expiresAt: string
  inviterName: string
  qrUrl: string
}

export interface InvitationDetails {
  id: string
  relationshipType: RelationshipType
  inviter: {
    id: string
    name: string
    email: string
  }
  expiresAt: string
  isExpired: boolean
  isAccepted: boolean
}

export interface CaregiverNote {
  id: string
  content: string
  noteDate: string
  createdAt: string
  updatedAt: string
}

export interface CreateNoteRequest {
  content: string
  noteDate?: string
}

export interface CaretakerCheckInRequest {
  note?: string
}

export interface CaretakerCheckInResponse {
  checkInDate: string
  checkedInAt: string
}

// Linked Contact types
export interface LinkedContact {
  id: string
  elderName: string
  elderEmail: string
  contactName: string
  relationshipSince: string
  hasActiveAlerts: boolean
}

export interface PendingContactInvitation {
  id: string
  elderName: string
  elderEmail: string
  contactName: string
  invitedAt: string
}

export interface ContactLinkInvitationDetails {
  contactId: string
  elderName: string
  elderEmail: string
  contactName: string
}

export interface AcceptContactLinkResult {
  success: boolean
  elderName: string
}
