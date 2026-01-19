/**
 * @file queryClient.ts
 * @description React Query client configuration
 * @task TASK-098
 * @design_state_version 3.12.0
 */
import { QueryClient } from '@tanstack/react-query'

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      retry: 1,
    },
  },
})
