/**
 * @file ElderModeSection.tsx
 * @description Elder Mode section - quick preset for elderly-friendly settings
 * @task TASK-046
 * @design_state_version 3.7.0
 */
import { useTranslation } from 'react-i18next';
import { Heart, User, Settings2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { hooks } from '@/lib/api';

export function ElderModeSection(): JSX.Element {
  const { t } = useTranslation('preferences');
  const { data: preferences, isLoading } = hooks.usePreferences();
  const updatePreferences = hooks.useUpdatePreferences();

  if (isLoading || !preferences) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Heart className="h-5 w-5" />
            {t('elderMode.title', 'Quick Mode Presets')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-24 animate-pulse rounded bg-muted" />
        </CardContent>
      </Card>
    );
  }

  const applyElderMode = (): void => {
    updatePreferences.mutate({
      fontSize: 22,
      highContrast: true,
      reducedMotion: true,
      warmColors: false,
    });
  };

  const applyStandardMode = (): void => {
    updatePreferences.mutate({
      fontSize: 16,
      highContrast: false,
      reducedMotion: false,
      warmColors: false,
    });
  };

  const isElderMode = preferences.fontSize >= 20 && preferences.highContrast && preferences.reducedMotion;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings2 className="h-5 w-5" />
          {t('elderMode.title', 'Quick Mode Presets')}
        </CardTitle>
        <CardDescription>
          {t('elderMode.description', 'Apply preset visual settings with one click')}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Button
            variant={isElderMode ? 'default' : 'outline'}
            className="h-auto py-4 flex-col items-start gap-2"
            onClick={applyElderMode}
          >
            <div className="flex items-center gap-2">
              <Heart className="h-5 w-5" />
              <span className="font-semibold">
                {t('elderMode.elderMode', 'Elder-Friendly Mode')}
              </span>
            </div>
            <span className="text-xs text-left opacity-80">
              {t('elderMode.elderModeDesc', 'Large text, high contrast, reduced animations')}
            </span>
          </Button>

          <Button
            variant={!isElderMode ? 'default' : 'outline'}
            className="h-auto py-4 flex-col items-start gap-2"
            onClick={applyStandardMode}
          >
            <div className="flex items-center gap-2">
              <User className="h-5 w-5" />
              <span className="font-semibold">
                {t('elderMode.standardMode', 'Standard Mode')}
              </span>
            </div>
            <span className="text-xs text-left opacity-80">
              {t('elderMode.standardModeDesc', 'Default settings with normal text size')}
            </span>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
