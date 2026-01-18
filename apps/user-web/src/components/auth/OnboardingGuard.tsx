/**
 * @file OnboardingGuard.tsx
 * @description Route guard that redirects users to onboarding if not completed
 */
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useTheme } from '@/contexts/ThemeContext';

export function OnboardingGuard(): JSX.Element {
  const { isOnboardingRequired, isLoading } = useTheme();
  const location = useLocation();

  // Show loading state while checking preferences
  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  // Redirect to onboarding if not completed
  if (isOnboardingRequired) {
    return <Navigate to="/onboarding" state={{ from: location }} replace />;
  }

  return <Outlet />;
}
