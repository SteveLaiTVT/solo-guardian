/* eslint-disable react-refresh/only-export-components */
/**
 * @file ThemeContext.tsx
 * @description Theme provider for visual preferences
 * @task TASK-022, TASK-098
 * @design_state_version 3.12.0
 */
import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useCallback,
  type ReactNode,
} from 'react';
import type { UserPreferences, UpdatePreferencesRequest } from '@solo-guardian/api-client';
import { hooks } from '@/lib/api';
import { useAuthStore } from '@/stores/auth.store';

interface ThemeContextValue {
  preferences: UserPreferences | undefined;
  isLoading: boolean;
  updatePreference: <K extends keyof UpdatePreferencesRequest>(
    key: K,
    value: UpdatePreferencesRequest[K]
  ) => void;
  isOnboardingRequired: boolean;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

interface ThemeProviderProps {
  children: ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps): JSX.Element {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  // Only fetch preferences when authenticated to avoid 401 errors on login page
  const { data: preferences, isLoading } = hooks.usePreferences({
    enabled: isAuthenticated,
  });
  const updateMutation = hooks.useUpdatePreferences();

  const updatePreference = useCallback(
    <K extends keyof UpdatePreferencesRequest>(
      key: K,
      value: UpdatePreferencesRequest[K]
    ): void => {
      updateMutation.mutate({ [key]: value });
    },
    [updateMutation]
  );

  // Only check onboarding when authenticated and preferences loaded
  const isOnboardingRequired = isAuthenticated && !isLoading && !!preferences && !preferences.onboardingCompleted;

  useEffect(() => {
    if (!preferences) return;

    const root = document.documentElement;

    // Apply font size
    root.style.fontSize = `${preferences.fontSize}px`;

    // Apply accessibility classes
    root.classList.toggle('high-contrast', preferences.highContrast);
    root.classList.toggle('warm-colors', preferences.warmColors && !preferences.highContrast);
    root.classList.toggle('reduced-motion', preferences.reducedMotion);

    // Apply theme class (if not in onboarding, which handles its own preview)
    const themeClasses = ['theme-standard', 'theme-warm', 'theme-nature', 'theme-ocean'];
    themeClasses.forEach((cls) => root.classList.remove(cls));
    if (preferences.theme) {
      root.classList.add(`theme-${preferences.theme}`);
    }

    return () => {
      root.style.fontSize = '';
      root.classList.remove('high-contrast', 'warm-colors', 'reduced-motion');
      themeClasses.forEach((cls) => root.classList.remove(cls));
    };
  }, [preferences]);

  const value = useMemo(
    () => ({
      preferences,
      isLoading,
      updatePreference,
      isOnboardingRequired,
    }),
    [preferences, isLoading, updatePreference, isOnboardingRequired]
  );

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextValue {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
