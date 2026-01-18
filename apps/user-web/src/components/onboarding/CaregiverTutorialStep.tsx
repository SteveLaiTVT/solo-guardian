/**
 * @file CaregiverTutorialStep.tsx
 * @description Tutorial step explaining caregiver/family access feature
 * @task TASK-087
 */
import { useTranslation } from 'react-i18next';
import { Heart, QrCode, UserPlus, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface CaregiverTutorialStepProps {
  onNext: () => void;
  onBack: () => void;
}

export function CaregiverTutorialStep({
  onNext,
  onBack,
}: CaregiverTutorialStepProps): JSX.Element {
  const { t } = useTranslation('onboarding');

  return (
    <div className="flex flex-col space-y-6">
      <div className="text-center space-y-2">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-rose-100">
          <Heart className="h-8 w-8 text-rose-600" />
        </div>
        <h2 className="text-2xl font-bold">{t('tutorial.caregiver.title')}</h2>
        <p className="text-muted-foreground">{t('tutorial.caregiver.subtitle')}</p>
      </div>

      <div className="space-y-4">
        <div className="flex items-start space-x-3 rounded-lg border p-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10">
            <UserPlus className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h3 className="font-medium">{t('tutorial.caregiver.invite')}</h3>
            <p className="text-sm text-muted-foreground">
              {t('tutorial.caregiver.inviteDesc')}
            </p>
          </div>
        </div>

        <div className="flex items-start space-x-3 rounded-lg border p-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10">
            <QrCode className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h3 className="font-medium">{t('tutorial.caregiver.qr')}</h3>
            <p className="text-sm text-muted-foreground">
              {t('tutorial.caregiver.qrDesc')}
            </p>
          </div>
        </div>

        <div className="flex items-start space-x-3 rounded-lg border p-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10">
            <Eye className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h3 className="font-medium">{t('tutorial.caregiver.monitor')}</h3>
            <p className="text-sm text-muted-foreground">
              {t('tutorial.caregiver.monitorDesc')}
            </p>
          </div>
        </div>

        <div className="flex items-start space-x-3 rounded-lg border p-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10">
            <Heart className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h3 className="font-medium">{t('tutorial.caregiver.checkIn')}</h3>
            <p className="text-sm text-muted-foreground">
              {t('tutorial.caregiver.checkInDesc')}
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
