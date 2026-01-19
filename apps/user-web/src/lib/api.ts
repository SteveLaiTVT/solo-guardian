/**
 * @file api.ts
 * @description API client setup with auth store integration
 * @task TASK-010, TASK-047, TASK-098
 * @design_state_version 3.12.0
 */
import { createApiClient, createApi, createHooks } from '@solo-guardian/api-client'
import { useAuthStore } from '@/stores/auth.store'
import { queryClient } from './queryClient'
import { config } from './config'

const client = createApiClient({
  baseUrl: config.apiUrl,
  getAccessToken: () => useAuthStore.getState().getAccessToken(),
  getRefreshToken: () => useAuthStore.getState().getRefreshToken(),
  onTokenRefresh: (tokens) => {
    useAuthStore.getState().setTokens(tokens.accessToken, tokens.refreshToken)
  },
  onAuthError: () => {
    // DONE(B): Clear query cache to prevent data leak between users - TASK-047
    queryClient.clear()
    useAuthStore.getState().clearTokens()
    window.location.href = '/login'
  },
})

export const api = createApi(client)
export const hooks = createHooks(client)
