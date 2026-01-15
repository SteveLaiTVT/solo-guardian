/**
 * @file ThemeContext.tsx
 * @description Theme provider for visual preferences
 * @task TASK-022
 * @design_state_version 1.6.0
 */
import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  type ReactNode,
} from 'react';
import type { UserPreferences, UpdatePreferencesRequest } from '@solo-guardian/api-client';
import { hooks } from '@/lib/api';

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
  const { data: preferences, isLoading } = hooks.usePreferences();
  const updateMutation = hooks.useUpdatePreferences();

  const updatePreference = <K extends keyof UpdatePreferencesRequest>(
    key: K,
    value: UpdatePreferencesRequest[K]
  ): void => {
    updateMutation.mutate({ [key]: value });
  };

  const isOnboardingRequired = !isLoading && !!preferences && !preferences.onboardingCompleted;

  useEffect(() => {
    if (!preferences) return;

    const root = document.documentElement;

    // Apply font size
    root.style.fontSize = `${preferences.fontSize}px`;

    // Apply theme classes
    root.classList.toggle('high-contrast', preferences.highContrast);
    root.classList.toggle('warm-colors', preferences.warmColors && !preferences.highContrast);
    root.classList.toggle('reduced-motion', preferences.reducedMotion);

    return () => {
      root.style.fontSize = '';
      root.classList.remove('high-contrast', 'warm-colors', 'reduced-motion');
    };
  }, [preferences]);

  const value = useMemo(
    () => ({
      preferences,
      isLoading,
      updatePreference,
      isOnboardingRequired,
    }),
    [preferences, isLoading, isOnboardingRequired]
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
