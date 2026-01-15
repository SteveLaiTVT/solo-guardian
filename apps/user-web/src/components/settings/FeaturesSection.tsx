/**
 * @file FeaturesSection.tsx
 * @description Features section in settings page
 * @task TASK-022
 * @design_state_version 1.6.0
 */
import { useTranslation } from 'react-i18next';
import { Sparkles, Heart, Users } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { hooks } from '@/lib/api';
import { FeatureToggle } from './FeatureToggle';

export function FeaturesSection(): JSX.Element {
  const { t } = useTranslation('preferences');
  const { data: preferences, isLoading } = hooks.usePreferences();
  const updatePreferences = hooks.useUpdatePreferences();

  if (isLoading || !preferences) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{t('features.title')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-32 animate-pulse rounded bg-muted" />
        </CardContent>
      </Card>
    );
  }

  const handleToggle = (key: 'preferFeaturesOn' | 'hobbyCheckIn' | 'familyAccess'): void => {
    updatePreferences.mutate({ [key]: !preferences[key] });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('features.title')}</CardTitle>
        <CardDescription>{t('features.description')}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <FeatureToggle
          icon={<Sparkles className="h-5 w-5 text-primary" />}
          title={t('features.preferFeaturesOn.title')}
          description={t('features.preferFeaturesOn.description')}
          enabled={preferences.preferFeaturesOn}
          onChange={() => handleToggle('preferFeaturesOn')}
        />

        <FeatureToggle
          icon={<Heart className="h-5 w-5 text-primary" />}
          title={t('features.hobbyCheckIn.title')}
          description={t('features.hobbyCheckIn.description')}
          enabled={preferences.hobbyCheckIn}
          onChange={() => handleToggle('hobbyCheckIn')}
        />

        <FeatureToggle
          icon={<Users className="h-5 w-5 text-primary" />}
          title={t('features.familyAccess.title')}
          description={t('features.familyAccess.description')}
          enabled={preferences.familyAccess}
          onChange={() => handleToggle('familyAccess')}
        />
      </CardContent>
    </Card>
  );
}
