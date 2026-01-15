import { createApiClient, createApi, createHooks } from '@solo-guardian/api-client'
import { useAuthStore } from '@/stores/auth.store'
import { config } from './config'

const client = createApiClient({
  baseUrl: config.apiUrl,
  getAccessToken: () => useAuthStore.getState().getAccessToken(),
  getRefreshToken: () => useAuthStore.getState().getRefreshToken(),
  onTokenRefresh: (tokens) => {
    useAuthStore.getState().setTokens(tokens.accessToken, tokens.refreshToken)
  },
  onAuthError: () => {
    useAuthStore.getState().clearTokens()
    window.location.href = '/login'
  },
})

export const api = createApi(client)
export const hooks = createHooks(client)
