/**
 * @file ContactsTutorialStep.tsx
 * @description Tutorial step explaining emergency contacts feature
 * @task TASK-087
 */
import { useTranslation } from 'react-i18next';
import { Users, Mail, Shield, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ContactsTutorialStepProps {
  onNext: () => void;
  onBack: () => void;
}

export function ContactsTutorialStep({
  onNext,
  onBack,
}: ContactsTutorialStepProps): JSX.Element {
  const { t } = useTranslation('onboarding');

  return (
    <div className="flex flex-col space-y-6">
      <div className="text-center space-y-2">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-blue-100">
          <Users className="h-8 w-8 text-blue-600" />
        </div>
        <h2 className="text-2xl font-bold">{t('tutorial.contacts.title')}</h2>
        <p className="text-muted-foreground">{t('tutorial.contacts.subtitle')}</p>
      </div>

      <div className="space-y-4">
        <div className="flex items-start space-x-3 rounded-lg border p-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10">
            <Users className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h3 className="font-medium">{t('tutorial.contacts.add')}</h3>
            <p className="text-sm text-muted-foreground">
              {t('tutorial.contacts.addDesc')}
            </p>
          </div>
        </div>

        <div className="flex items-start space-x-3 rounded-lg border p-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10">
            <Mail className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h3 className="font-medium">{t('tutorial.contacts.verify')}</h3>
            <p className="text-sm text-muted-foreground">
              {t('tutorial.contacts.verifyDesc')}
            </p>
          </div>
        </div>

        <div className="flex items-start space-x-3 rounded-lg border p-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10">
            <AlertTriangle className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h3 className="font-medium">{t('tutorial.contacts.alert')}</h3>
            <p className="text-sm text-muted-foreground">
              {t('tutorial.contacts.alertDesc')}
            </p>
          </div>
        </div>

        <div className="flex items-start space-x-3 rounded-lg border p-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10">
            <Shield className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h3 className="font-medium">{t('tutorial.contacts.privacy')}</h3>
            <p className="text-sm text-muted-foreground">
              {t('tutorial.contacts.privacyDesc')}
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
