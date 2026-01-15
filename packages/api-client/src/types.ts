// User types
export interface User {
  id: string
  email: string
  name: string
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
  email: string
  password: string
}

export interface RegisterRequest {
  email: string
  password: string
  name: string
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

// Emergency Contact types
export interface EmergencyContact {
  id: string
  userId: string
  name: string
  email: string
  phone: string | null
  priority: number
  isVerified: boolean
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface CreateContactRequest {
  name: string
  email: string
  phone?: string
  priority?: number
}

export interface UpdateContactRequest {
  name?: string
  email?: string
  phone?: string
  priority?: number
  isActive?: boolean
}

export interface ReorderContactsRequest {
  contactIds: string[]
}
