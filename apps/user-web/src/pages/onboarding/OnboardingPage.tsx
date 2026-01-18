/**
 * @file OnboardingPage.tsx
 * @description Onboarding flow page for new users with tutorials
 * @task TASK-022, TASK-087
 */
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { hooks } from '@/lib/api';
import { LanguageSwitcher } from '@/components/ui/LanguageSwitcher';
import type { ThemeType } from '@solo-guardian/api-client';
import {
  WelcomeStep,
  ProfileStep,
  ThemeStep,
  PreferenceStep,
  FeaturesStep,
  VisualStep,
  CheckInTutorialStep,
  ContactsTutorialStep,
  CaregiverTutorialStep,
} from '@/components/onboarding';

type OnboardingStep =
  | 'welcome'
  | 'profile'
  | 'theme'
  | 'preference'
  | 'features'
  | 'visual'
  | 'checkInTutorial'
  | 'contactsTutorial'
  | 'caregiverTutorial';

interface OnboardingState {
  birthYear: number | null;
  theme: ThemeType;
  preferFeaturesOn: boolean;
  hobbyCheckIn: boolean;
  familyAccess: boolean;
  fontSize: number;
  highContrast: boolean;
  reducedMotion: boolean;
  warmColors: boolean;
}

export function OnboardingPage(): JSX.Element {
  const navigate = useNavigate();
  const updatePreferences = hooks.useUpdatePreferences();
  const updateProfile = hooks.useUpdateProfile();
  const completeOnboarding = hooks.useCompleteOnboarding();

  const [step, setStep] = useState<OnboardingStep>('welcome');
  const [state, setState] = useState<OnboardingState>({
    birthYear: null,
    theme: 'standard',
    preferFeaturesOn: false,
    hobbyCheckIn: false,
    familyAccess: false,
    fontSize: 16,
    highContrast: false,
    reducedMotion: false,
    warmColors: false,
  });

  const handleFinish = async (): Promise<void> => {
    // Update profile if birth year was set
    if (state.birthYear !== null) {
      await updateProfile.mutateAsync({ birthYear: state.birthYear });
    }

    // Update preferences
    await updatePreferences.mutateAsync({
      theme: state.theme,
      preferFeaturesOn: state.preferFeaturesOn,
      hobbyCheckIn: state.hobbyCheckIn,
      familyAccess: state.familyAccess,
      fontSize: state.fontSize,
      highContrast: state.highContrast,
      reducedMotion: state.reducedMotion,
      warmColors: state.warmColors,
    });

    await completeOnboarding.mutateAsync();
    navigate('/');
  };

  // Apply theme preview when theme changes during onboarding
  useEffect(() => {
    const root = document.documentElement;

    // Remove all theme classes first
    root.classList.remove('theme-standard', 'theme-warm', 'theme-nature', 'theme-ocean');

    // Apply the selected theme class for preview
    root.classList.add(`theme-${state.theme}`);

    return () => {
      // Clean up theme class when component unmounts
      root.classList.remove('theme-standard', 'theme-warm', 'theme-nature', 'theme-ocean');
    };
  }, [state.theme]);

  const stepIndicators = [
    'welcome',
    'profile',
    'theme',
    'preference',
    'features',
    'visual',
    'checkInTutorial',
    'contactsTutorial',
    'caregiverTutorial',
  ] as const;
  const currentStepIndex = stepIndicators.indexOf(step);

  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Language switcher */}
      <div className="absolute right-4 top-4">
        <LanguageSwitcher />
      </div>
      <div className="mx-auto flex w-full max-w-md flex-1 flex-col px-4 py-8">
        {/* Step indicator */}
        <div className="mb-8 flex justify-center space-x-2">
          {stepIndicators.map((s, index) => (
            <div
              key={s}
              className={`h-2 w-6 rounded-full transition-colors ${
                index <= currentStepIndex ? 'bg-primary' : 'bg-muted'
              }`}
            />
          ))}
        </div>

        {/* Step content */}
        <div className="flex-1">
          {step === 'welcome' && (
            <WelcomeStep onNext={() => setStep('profile')} />
          )}

          {step === 'profile' && (
            <ProfileStep
              birthYear={state.birthYear}
              onBirthYearChange={(year) => setState((s) => ({ ...s, birthYear: year }))}
              onNext={() => setStep('theme')}
              onSkip={() => setStep('theme')}
            />
          )}

          {step === 'theme' && (
            <ThemeStep
              theme={state.theme}
              onThemeChange={(theme) => setState((s) => ({ ...s, theme }))}
              onNext={() => setStep('preference')}
              onSkip={() => setStep('preference')}
            />
          )}

          {step === 'preference' && (
            <PreferenceStep
              value={state.preferFeaturesOn}
              onChange={(value) => setState((s) => ({ ...s, preferFeaturesOn: value }))}
              onNext={() => setStep('features')}
              onBack={() => setStep('theme')}
            />
          )}

          {step === 'features' && (
            <FeaturesStep
              value={{
                hobbyCheckIn: state.hobbyCheckIn,
                familyAccess: state.familyAccess,
              }}
              onChange={(value) =>
                setState((s) => ({
                  ...s,
                  hobbyCheckIn: value.hobbyCheckIn,
                  familyAccess: value.familyAccess,
                }))
              }
              onNext={() => setStep('visual')}
              onBack={() => setStep('preference')}
            />
          )}

          {step === 'visual' && (
            <VisualStep
              value={{
                fontSize: state.fontSize,
                highContrast: state.highContrast,
                reducedMotion: state.reducedMotion,
                warmColors: state.warmColors,
              }}
              onChange={(value) =>
                setState((s) => ({
                  ...s,
                  fontSize: value.fontSize,
                  highContrast: value.highContrast,
                  reducedMotion: value.reducedMotion,
                  warmColors: value.warmColors,
                }))
              }
              onFinish={() => setStep('checkInTutorial')}
              onBack={() => setStep('features')}
              isLoading={false}
            />
          )}

          {step === 'checkInTutorial' && (
            <CheckInTutorialStep
              onNext={() => setStep('contactsTutorial')}
              onBack={() => setStep('visual')}
            />
          )}

          {step === 'contactsTutorial' && (
            <ContactsTutorialStep
              onNext={() => setStep('caregiverTutorial')}
              onBack={() => setStep('checkInTutorial')}
            />
          )}

          {step === 'caregiverTutorial' && (
            <CaregiverTutorialStep
              onNext={() => void handleFinish()}
              onBack={() => setStep('contactsTutorial')}
            />
          )}
        </div>
      </div>
    </div>
  );
}
