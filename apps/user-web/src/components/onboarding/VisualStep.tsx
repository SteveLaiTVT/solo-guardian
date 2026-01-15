/**
 * @file VisualStep.tsx
 * @description Visual preferences selection for onboarding
 * @task TASK-022
 * @design_state_version 1.6.0
 */
import { useTranslation } from 'react-i18next';
import { Sun, Contrast, Eye, Palette } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';

interface VisualState {
  fontSize: number;
  highContrast: boolean;
  reducedMotion: boolean;
  warmColors: boolean;
}

interface VisualStepProps {
  value: VisualState;
  onChange: (value: VisualState) => void;
  onFinish: () => void;
  onBack: () => void;
  isLoading: boolean;
}

export function VisualStep({
  value,
  onChange,
  onFinish,
  onBack,
  isLoading,
}: VisualStepProps): JSX.Element {
  const { t } = useTranslation('onboarding');

  const toggleSetting = (key: keyof Omit<VisualState, 'fontSize'>): void => {
    onChange({ ...value, [key]: !value[key] });
  };

  const handleFontSizeChange = (fontSize: number): void => {
    onChange({ ...value, fontSize });
  };

  return (
    <div className="flex flex-col space-y-6">
      <div className="space-y-2 text-center">
        <h2 className="text-2xl font-bold">{t('visual.title')}</h2>
        <p className="text-muted-foreground">{t('visual.subtitle')}</p>
      </div>

      <div className="space-y-4">
        <Card>
          <CardContent className="p-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label htmlFor="fontSize" className="flex items-center space-x-2">
                  <Sun className="h-4 w-4" />
                  <span>{t('visual.fontSize')}</span>
                </Label>
                <span className="text-sm text-muted-foreground">{value.fontSize}px</span>
              </div>
              <input
                id="fontSize"
                type="range"
                min="14"
                max="24"
                value={value.fontSize}
                onChange={(e) => handleFontSizeChange(Number(e.target.value))}
                className="w-full accent-primary"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>14px</span>
                <span>24px</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card
          className={`cursor-pointer transition-all ${
            value.highContrast ? 'border-primary' : ''
          }`}
          onClick={() => toggleSetting('highContrast')}
        >
          <CardContent className="flex items-center justify-between p-4">
            <div className="flex items-center space-x-3">
              <Contrast className="h-5 w-5" />
              <span className="font-medium">{t('visual.highContrast')}</span>
            </div>
            <div
              className={`h-5 w-9 rounded-full transition-colors ${
                value.highContrast ? 'bg-primary' : 'bg-muted'
              }`}
            >
              <div
                className={`h-5 w-5 rounded-full bg-white shadow-sm transition-transform ${
                  value.highContrast ? 'translate-x-4' : ''
                }`}
              />
            </div>
          </CardContent>
        </Card>

        <Card
          className={`cursor-pointer transition-all ${
            value.reducedMotion ? 'border-primary' : ''
          }`}
          onClick={() => toggleSetting('reducedMotion')}
        >
          <CardContent className="flex items-center justify-between p-4">
            <div className="flex items-center space-x-3">
              <Eye className="h-5 w-5" />
              <span className="font-medium">{t('visual.reducedMotion')}</span>
            </div>
            <div
              className={`h-5 w-9 rounded-full transition-colors ${
                value.reducedMotion ? 'bg-primary' : 'bg-muted'
              }`}
            >
              <div
                className={`h-5 w-5 rounded-full bg-white shadow-sm transition-transform ${
                  value.reducedMotion ? 'translate-x-4' : ''
                }`}
              />
            </div>
          </CardContent>
        </Card>

        <Card
          className={`cursor-pointer transition-all ${
            value.warmColors ? 'border-primary' : ''
          }`}
          onClick={() => toggleSetting('warmColors')}
        >
          <CardContent className="flex items-center justify-between p-4">
            <div className="flex items-center space-x-3">
              <Palette className="h-5 w-5" />
              <span className="font-medium">{t('visual.warmColors')}</span>
            </div>
            <div
              className={`h-5 w-9 rounded-full transition-colors ${
                value.warmColors ? 'bg-primary' : 'bg-muted'
              }`}
            >
              <div
                className={`h-5 w-5 rounded-full bg-white shadow-sm transition-transform ${
                  value.warmColors ? 'translate-x-4' : ''
                }`}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-between pt-4">
        <Button variant="ghost" onClick={onBack}>
          {t('back')}
        </Button>
        <Button onClick={onFinish} disabled={isLoading}>
          {isLoading ? t('saving') : t('finish')}
        </Button>
      </div>
    </div>
  );
}
