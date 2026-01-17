/**
 * @file App.tsx
 * @description Main application component with routing configuration
 * @task TASK-010, TASK-016, TASK-019, TASK-022, TASK-033, TASK-062, TASK-063
 * @design_state_version 3.8.0
 */
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from 'sonner'
import { ProtectedRoute, GuestRoute } from '@/components/auth'
import { Layout } from '@/components/layout'
import { ErrorBoundary } from '@/components/ErrorBoundary'
import { ThemeProvider } from '@/contexts/ThemeContext'
import { LoginPage, RegisterPage } from '@/pages/auth'
import { DashboardPage, HistoryPage } from '@/pages/dashboard'
import { SettingsPage } from '@/pages/settings'
import { ContactsPage } from '@/pages/contacts'
import { OnboardingPage } from '@/pages/onboarding'
import { VerifyContactPage } from '@/pages/verify-contact'
import { AcceptInvitationPage } from '@/pages/accept-invitation'
import { CaregiverPage } from '@/pages/caregiver'

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      retry: 1,
    },
  },
})

function App(): JSX.Element {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <Toaster position="top-right" />
          <BrowserRouter>
            <Routes>
              {/* Public routes (no auth check) */}
              <Route path="/verify-contact" element={<VerifyContactPage />} />
              <Route path="/accept-invitation/:token" element={<AcceptInvitationPage />} />

              {/* Guest routes (redirect if logged in) */}
              <Route element={<GuestRoute />}>
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
              </Route>

              {/* Protected routes */}
              <Route element={<ProtectedRoute />}>
                <Route path="/onboarding" element={<OnboardingPage />} />
                <Route element={<Layout />}>
                  <Route path="/" element={<DashboardPage />} />
                  <Route path="/history" element={<HistoryPage />} />
                  <Route path="/contacts" element={<ContactsPage />} />
                  <Route path="/settings" element={<SettingsPage />} />
                  <Route path="/caregiver" element={<CaregiverPage />} />
                </Route>
              </Route>

              {/* Fallback */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </BrowserRouter>
        </ThemeProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  )
}

export default App
