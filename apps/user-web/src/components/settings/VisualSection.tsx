/**
 * @file VisualSection.tsx
 * @description Visual preferences section in settings page
 * @task TASK-022
 * @design_state_version 1.6.0
 */
import { useTranslation } from 'react-i18next';
import { Sun, Contrast, Eye, Palette } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { hooks } from '@/lib/api';
import { FeatureToggle } from './FeatureToggle';

export function VisualSection(): JSX.Element {
  const { t } = useTranslation('preferences');
  const { data: preferences, isLoading } = hooks.usePreferences();
  const updatePreferences = hooks.useUpdatePreferences();

  if (isLoading || !preferences) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{t('visual.title')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-48 animate-pulse rounded bg-muted" />
        </CardContent>
      </Card>
    );
  }

  const handleFontSizeChange = (fontSize: number): void => {
    updatePreferences.mutate({ fontSize });
  };

  const handleToggle = (key: 'highContrast' | 'reducedMotion' | 'warmColors'): void => {
    updatePreferences.mutate({ [key]: !preferences[key] });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('visual.title')}</CardTitle>
        <CardDescription>{t('visual.description')}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3 rounded-lg border p-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="fontSize" className="flex items-center space-x-2">
              <Sun className="h-4 w-4" />
              <span>{t('visual.fontSize')}</span>
            </Label>
            <span className="text-sm text-muted-foreground">{preferences.fontSize}px</span>
          </div>
          <input
            id="fontSize"
            type="range"
            min="14"
            max="24"
            value={preferences.fontSize}
            onChange={(e) => handleFontSizeChange(Number(e.target.value))}
            className="w-full accent-primary"
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>14px</span>
            <span>24px</span>
          </div>
        </div>

        <FeatureToggle
          icon={<Contrast className="h-5 w-5 text-primary" />}
          title={t('visual.highContrast')}
          description={t('visual.highContrastDesc')}
          enabled={preferences.highContrast}
          onChange={() => handleToggle('highContrast')}
        />

        <FeatureToggle
          icon={<Eye className="h-5 w-5 text-primary" />}
          title={t('visual.reducedMotion')}
          description={t('visual.reducedMotionDesc')}
          enabled={preferences.reducedMotion}
          onChange={() => handleToggle('reducedMotion')}
        />

        <FeatureToggle
          icon={<Palette className="h-5 w-5 text-primary" />}
          title={t('visual.warmColors')}
          description={t('visual.warmColorsDesc')}
          enabled={preferences.warmColors}
          onChange={() => handleToggle('warmColors')}
        />
      </CardContent>
    </Card>
  );
}
