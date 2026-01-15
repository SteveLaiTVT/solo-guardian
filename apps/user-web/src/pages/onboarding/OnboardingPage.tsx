/**
 * @file OnboardingPage.tsx
 * @description Onboarding flow page for new users
 * @task TASK-022
 * @design_state_version 1.6.0
 */
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { hooks } from '@/lib/api';
import {
  WelcomeStep,
  PreferenceStep,
  FeaturesStep,
  VisualStep,
} from '@/components/onboarding';

type OnboardingStep = 'welcome' | 'preference' | 'features' | 'visual';

interface OnboardingState {
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
  const completeOnboarding = hooks.useCompleteOnboarding();

  const [step, setStep] = useState<OnboardingStep>('welcome');
  const [state, setState] = useState<OnboardingState>({
    preferFeaturesOn: false,
    hobbyCheckIn: false,
    familyAccess: false,
    fontSize: 16,
    highContrast: false,
    reducedMotion: false,
    warmColors: false,
  });

  const handleFinish = async (): Promise<void> => {
    await updatePreferences.mutateAsync({
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

  const stepIndicators = ['welcome', 'preference', 'features', 'visual'] as const;
  const currentStepIndex = stepIndicators.indexOf(step);

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <div className="mx-auto flex w-full max-w-md flex-1 flex-col px-4 py-8">
        {/* Step indicator */}
        <div className="mb-8 flex justify-center space-x-2">
          {stepIndicators.map((s, index) => (
            <div
              key={s}
              className={`h-2 w-8 rounded-full transition-colors ${
                index <= currentStepIndex ? 'bg-primary' : 'bg-muted'
              }`}
            />
          ))}
        </div>

        {/* Step content */}
        <div className="flex-1">
          {step === 'welcome' && (
            <WelcomeStep onNext={() => setStep('preference')} />
          )}

          {step === 'preference' && (
            <PreferenceStep
              value={state.preferFeaturesOn}
              onChange={(value) => setState((s) => ({ ...s, preferFeaturesOn: value }))}
              onNext={() => setStep('features')}
              onBack={() => setStep('welcome')}
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
              onFinish={() => void handleFinish()}
              onBack={() => setStep('features')}
              isLoading={updatePreferences.isPending || completeOnboarding.isPending}
            />
          )}
        </div>
      </div>
    </div>
  );
}
