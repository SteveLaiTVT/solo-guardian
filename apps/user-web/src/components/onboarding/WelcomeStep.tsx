/**
 * @file WelcomeStep.tsx
 * @description Welcome screen for onboarding
 * @task TASK-022
 * @design_state_version 1.6.0
 */
import { useTranslation } from 'react-i18next';
import { Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface WelcomeStepProps {
  onNext: () => void;
}

export function WelcomeStep({ onNext }: WelcomeStepProps): JSX.Element {
  const { t } = useTranslation('onboarding');

  return (
    <div className="flex flex-col items-center justify-center space-y-8 text-center">
      <div className="flex h-24 w-24 items-center justify-center rounded-full bg-primary/10">
        <Shield className="h-12 w-12 text-primary" />
      </div>

      <div className="space-y-3">
        <h1 className="text-3xl font-bold">{t('welcome.title')}</h1>
        <p className="text-lg text-muted-foreground">{t('welcome.subtitle')}</p>
      </div>

      <Button size="lg" onClick={onNext} className="px-8">
        {t('welcome.getStarted')}
      </Button>
    </div>
  );
}
