/**
 * @file FeaturesStep.tsx
 * @description Feature toggle selection for onboarding
 * @task TASK-022
 * @design_state_version 1.6.0
 */
import { useTranslation } from 'react-i18next';
import { Heart, Users, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface FeatureState {
  hobbyCheckIn: boolean;
  familyAccess: boolean;
}

interface FeaturesStepProps {
  value: FeatureState;
  onChange: (value: FeatureState) => void;
  onNext: () => void;
  onBack: () => void;
}

export function FeaturesStep({
  value,
  onChange,
  onNext,
  onBack,
}: FeaturesStepProps): JSX.Element {
  const { t } = useTranslation('onboarding');

  const toggleFeature = (key: keyof FeatureState): void => {
    onChange({ ...value, [key]: !value[key] });
  };

  const enableAll = (): void => {
    onChange({ hobbyCheckIn: true, familyAccess: true });
  };

  const disableAll = (): void => {
    onChange({ hobbyCheckIn: false, familyAccess: false });
  };

  return (
    <div className="flex flex-col space-y-6">
      <div className="space-y-2 text-center">
        <h2 className="text-2xl font-bold">{t('features.title')}</h2>
        <p className="text-muted-foreground">{t('features.subtitle')}</p>
      </div>

      <div className="grid gap-4">
        <Card
          className={`cursor-pointer transition-all ${
            value.hobbyCheckIn ? 'border-primary' : ''
          }`}
          onClick={() => toggleFeature('hobbyCheckIn')}
        >
          <CardContent className="flex items-center space-x-4 p-4">
            <div
              className={`flex h-12 w-12 items-center justify-center rounded-full ${
                value.hobbyCheckIn ? 'bg-primary/10' : 'bg-muted'
              }`}
            >
              <Heart
                className={`h-6 w-6 ${
                  value.hobbyCheckIn ? 'text-primary' : 'text-muted-foreground'
                }`}
              />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold">{t('features.hobbyCheckIn.title')}</h3>
              <p className="text-sm text-muted-foreground">
                {t('features.hobbyCheckIn.description')}
              </p>
            </div>
            {value.hobbyCheckIn && (
              <Check className="h-5 w-5 text-primary" />
            )}
          </CardContent>
        </Card>

        <Card
          className={`cursor-pointer transition-all ${
            value.familyAccess ? 'border-primary' : ''
          }`}
          onClick={() => toggleFeature('familyAccess')}
        >
          <CardContent className="flex items-center space-x-4 p-4">
            <div
              className={`flex h-12 w-12 items-center justify-center rounded-full ${
                value.familyAccess ? 'bg-primary/10' : 'bg-muted'
              }`}
            >
              <Users
                className={`h-6 w-6 ${
                  value.familyAccess ? 'text-primary' : 'text-muted-foreground'
                }`}
              />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold">{t('features.familyAccess.title')}</h3>
              <p className="text-sm text-muted-foreground">
                {t('features.familyAccess.description')}
              </p>
            </div>
            {value.familyAccess && (
              <Check className="h-5 w-5 text-primary" />
            )}
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-center space-x-4">
        <Button variant="outline" size="sm" onClick={disableAll}>
          {t('features.presetSimple')}
        </Button>
        <Button variant="outline" size="sm" onClick={enableAll}>
          {t('features.presetAll')}
        </Button>
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
