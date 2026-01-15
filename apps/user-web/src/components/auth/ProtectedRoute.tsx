/**
 * @file ProtectedRoute.tsx
 * @description Route guard that redirects unauthenticated users to login
 * @task TASK-010
 * @design_state_version 1.2.0
 */
import { Navigate, Outlet } from 'react-router-dom'
import { useAuthStore } from '@/stores/auth.store'

export function ProtectedRoute(): JSX.Element {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  return <Outlet />
}
