/**
 * @file PreferenceStep.tsx
 * @description Feature preference selection for onboarding
 * @task TASK-022
 * @design_state_version 1.6.0
 */
import { useTranslation } from 'react-i18next';
import { Sparkles, Settings2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface PreferenceStepProps {
  value: boolean;
  onChange: (value: boolean) => void;
  onNext: () => void;
  onBack: () => void;
}

export function PreferenceStep({
  value,
  onChange,
  onNext,
  onBack,
}: PreferenceStepProps): JSX.Element {
  const { t } = useTranslation('onboarding');

  return (
    <div className="flex flex-col space-y-6">
      <div className="space-y-2 text-center">
        <h2 className="text-2xl font-bold">{t('preference.title')}</h2>
        <p className="text-muted-foreground">{t('preference.subtitle')}</p>
      </div>

      <div className="grid gap-4">
        <Card
          className={`cursor-pointer transition-all ${
            value ? 'border-primary ring-2 ring-primary' : ''
          }`}
          onClick={() => onChange(true)}
        >
          <CardContent className="flex items-center space-x-4 p-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
              <Sparkles className="h-6 w-6 text-primary" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold">{t('preference.enableAll')}</h3>
              <p className="text-sm text-muted-foreground">
                {t('preference.enableAllDesc')}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card
          className={`cursor-pointer transition-all ${
            !value ? 'border-primary ring-2 ring-primary' : ''
          }`}
          onClick={() => onChange(false)}
        >
          <CardContent className="flex items-center space-x-4 p-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
              <Settings2 className="h-6 w-6 text-muted-foreground" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold">{t('preference.keepSimple')}</h3>
              <p className="text-sm text-muted-foreground">
                {t('preference.keepSimpleDesc')}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-between pt-4">
        <Button variant="ghost" onClick={onBack}>
          {t('back')}
        </Button>
        <Button onClick={onNext}>{t('next')}</Button>
      </div>
    </div>
  );
}
