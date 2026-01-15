/**
 * @file GuestRoute.tsx
 * @description Route guard that redirects authenticated users to dashboard
 * @task TASK-010
 * @design_state_version 1.2.0
 */
import { Navigate, Outlet } from 'react-router-dom'
import { useAuthStore } from '@/stores/auth.store'

export function GuestRoute(): JSX.Element {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)

  if (isAuthenticated) {
    return <Navigate to="/" replace />
  }

  return <Outlet />
}
