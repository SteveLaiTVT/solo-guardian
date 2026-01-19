/**
 * @file App.tsx
 * @description Main application component with routing configuration
 * @task TASK-010, TASK-016, TASK-019, TASK-022, TASK-033, TASK-062, TASK-063, TASK-072, TASK-073, TASK-095, TASK-098, TASK-101
 * @design_state_version 3.12.0
 */
import { lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from 'sonner'
import { ProtectedRoute, GuestRoute, OnboardingGuard, OAuthCallback } from '@/components/auth'
import { Layout } from '@/components/layout'
import { ErrorBoundary } from '@/components/ErrorBoundary'
import { ThemeProvider } from '@/contexts/ThemeContext'
import { queryClient } from '@/lib/queryClient'
import { LoadingSpinner } from '@/components/ui/loading-spinner'

const LoginPage = lazy(() => import('@/pages/auth/LoginPage'))
const RegisterPage = lazy(() => import('@/pages/auth/RegisterPage'))
const DashboardPage = lazy(() => import('@/pages/dashboard/DashboardPage'))
const HistoryPage = lazy(() => import('@/pages/dashboard/HistoryPage'))
const SettingsPage = lazy(() => import('@/pages/settings/SettingsPage'))
const ContactsPage = lazy(() => import('@/pages/contacts/ContactsPage'))
const LinkedContactsPage = lazy(() => import('@/pages/contacts/LinkedContactsPage'))
const OnboardingPage = lazy(() => import('@/pages/onboarding/OnboardingPage'))
const VerifyContactPage = lazy(() => import('@/pages/verify-contact/VerifyContactPage'))
const AcceptInvitationPage = lazy(() => import('@/pages/accept-invitation/AcceptInvitationPage'))
const AcceptContactLinkPage = lazy(() => import('@/pages/accept-contact-link/AcceptContactLinkPage'))
const CaregiverPage = lazy(() => import('@/pages/caregiver/CaregiverPage'))

function App(): JSX.Element {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <Toaster position="top-right" />
          <BrowserRouter>
            <Suspense fallback={<LoadingSpinner fullScreen />}>
              <Routes>
              {/* Public routes (no auth check) */}
              <Route path="/auth/callback" element={<OAuthCallback />} />
              <Route path="/verify-contact" element={<VerifyContactPage />} />
              <Route path="/accept-invitation/:token" element={<AcceptInvitationPage />} />
              <Route path="/accept-contact-link/:token" element={<AcceptContactLinkPage />} />

              {/* Guest routes (redirect if logged in) */}
              <Route element={<GuestRoute />}>
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
              </Route>

              {/* Protected routes */}
              <Route element={<ProtectedRoute />}>
                {/* Onboarding page - accessible even if onboarding not completed */}
                <Route path="/onboarding" element={<OnboardingPage />} />

                {/* Main app routes - require onboarding to be completed */}
                <Route element={<OnboardingGuard />}>
                  <Route element={<Layout />}>
                    <Route path="/" element={<DashboardPage />} />
                    <Route path="/history" element={<HistoryPage />} />
                    <Route path="/contacts" element={<ContactsPage />} />
                    <Route path="/contacts/linked" element={<LinkedContactsPage />} />
                    <Route path="/settings" element={<SettingsPage />} />
                    <Route path="/caregiver" element={<CaregiverPage />} />
                  </Route>
                </Route>
              </Route>

              {/* Fallback */}
              <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </Suspense>
          </BrowserRouter>
        </ThemeProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  )
}

export default App
