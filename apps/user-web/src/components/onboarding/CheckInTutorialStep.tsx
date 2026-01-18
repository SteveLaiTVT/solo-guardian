/**
 * @file CheckInTutorialStep.tsx
 * @description Tutorial step explaining daily check-in feature
 * @task TASK-087
 */
import { useTranslation } from 'react-i18next';
import { CheckCircle, Bell, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface CheckInTutorialStepProps {
  onNext: () => void;
  onBack: () => void;
}

export function CheckInTutorialStep({
  onNext,
  onBack,
}: CheckInTutorialStepProps): JSX.Element {
  const { t } = useTranslation('onboarding');

  return (
    <div className="flex flex-col space-y-6">
      <div className="text-center space-y-2">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
          <CheckCircle className="h-8 w-8 text-green-600" />
        </div>
        <h2 className="text-2xl font-bold">{t('tutorial.checkIn.title')}</h2>
        <p className="text-muted-foreground">{t('tutorial.checkIn.subtitle')}</p>
      </div>

      <div className="space-y-4">
        <div className="flex items-start space-x-3 rounded-lg border p-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10">
            <CheckCircle className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h3 className="font-medium">{t('tutorial.checkIn.howTo')}</h3>
            <p className="text-sm text-muted-foreground">
              {t('tutorial.checkIn.howToDesc')}
            </p>
          </div>
        </div>

        <div className="flex items-start space-x-3 rounded-lg border p-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10">
            <Clock className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h3 className="font-medium">{t('tutorial.checkIn.deadline')}</h3>
            <p className="text-sm text-muted-foreground">
              {t('tutorial.checkIn.deadlineDesc')}
            </p>
          </div>
        </div>

        <div className="flex items-start space-x-3 rounded-lg border p-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10">
            <Bell className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h3 className="font-medium">{t('tutorial.checkIn.reminder')}</h3>
            <p className="text-sm text-muted-foreground">
              {t('tutorial.checkIn.reminderDesc')}
            </p>
          </div>
        </div>
      </div>

      <div className="flex justify-between pt-4">
        <Button variant="outline" onClick={onBack}>
          {t('back')}
        </Button>
        <Button onClick={onNext}>{t('next')}</Button>
      </div>
    </div>
  );
}
