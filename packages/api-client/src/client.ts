import axios, { type AxiosInstance, type InternalAxiosRequestConfig } from "axios"
import type { AuthTokens } from "./types"

export interface ApiClientConfig {
  baseUrl: string
  getAccessToken: () => string | null
  getRefreshToken: () => string | null
  onTokenRefresh: (tokens: AuthTokens) => void
  onAuthError: () => void
}

export function createApiClient(config: ApiClientConfig): AxiosInstance {
  const client = axios.create({
    baseURL: config.baseUrl,
    headers: { "Content-Type": "application/json" },
  })

  // Request interceptor - add token
  client.interceptors.request.use((req: InternalAxiosRequestConfig) => {
    const token = config.getAccessToken()
    if (token && req.headers) {
      req.headers.Authorization = `Bearer ${token}`
    }
    return req
  })

  // Response interceptor - handle 401
  client.interceptors.response.use(
    (res) => res,
    async (error: { response?: { status: number }; config: InternalAxiosRequestConfig & { _retry?: boolean } }) => {
      const originalRequest = error.config

      // Check if 401 and not already retrying
      if (
        error.response?.status === 401 &&
        !originalRequest._retry &&
        !originalRequest.url?.includes("/auth/refresh")
      ) {
        originalRequest._retry = true

        const refreshToken = config.getRefreshToken()
        if (!refreshToken) {
          config.onAuthError()
          return Promise.reject(error)
        }

        try {
          const response = await axios.post<{ success: true; data: AuthTokens }>(
            `${config.baseUrl}/api/v1/auth/refresh`,
            { refreshToken }
          )
          const tokens = response.data.data
          config.onTokenRefresh(tokens)

          // Retry original request with new token
          originalRequest.headers.Authorization = `Bearer ${tokens.accessToken}`
          return client(originalRequest)
        } catch {
          config.onAuthError()
          return Promise.reject(error)
        }
      }

      return Promise.reject(error)
    }
  )

  return client
}
