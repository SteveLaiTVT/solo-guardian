/**
 * @file ThemeStep.tsx
 * @description Theme selection step for onboarding
 */
import { useTranslation } from 'react-i18next';
import { Palette, Sun, Leaf, Waves } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { ThemeType } from '@solo-guardian/api-client';

interface ThemeStepProps {
  theme: ThemeType;
  onThemeChange: (theme: ThemeType) => void;
  onNext: () => void;
  onSkip: () => void;
}

interface ThemeOption {
  id: ThemeType;
  icon: React.ComponentType<{ className?: string }>;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
  };
}

const themeOptions: ThemeOption[] = [
  {
    id: 'standard',
    icon: Palette,
    colors: {
      primary: 'bg-teal-600',
      secondary: 'bg-teal-400',
      accent: 'bg-amber-100',
    },
  },
  {
    id: 'warm',
    icon: Sun,
    colors: {
      primary: 'bg-orange-500',
      secondary: 'bg-amber-400',
      accent: 'bg-yellow-100',
    },
  },
  {
    id: 'nature',
    icon: Leaf,
    colors: {
      primary: 'bg-green-600',
      secondary: 'bg-emerald-400',
      accent: 'bg-lime-100',
    },
  },
  {
    id: 'ocean',
    icon: Waves,
    colors: {
      primary: 'bg-sky-500',
      secondary: 'bg-cyan-400',
      accent: 'bg-blue-100',
    },
  },
];

export function ThemeStep({
  theme,
  onThemeChange,
  onNext,
  onSkip,
}: ThemeStepProps): JSX.Element {
  const { t } = useTranslation('onboarding');

  return (
    <div className="flex flex-col items-center justify-center space-y-8 text-center">
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
        <Palette className="h-10 w-10 text-primary" />
      </div>

      <div className="space-y-3">
        <h2 className="text-2xl font-bold">{t('theme.title')}</h2>
        <p className="text-muted-foreground">{t('theme.subtitle')}</p>
      </div>

      <div className="grid grid-cols-2 gap-4 w-full max-w-sm">
        {themeOptions.map((option) => {
          const Icon = option.icon;
          const isSelected = theme === option.id;

          return (
            <button
              key={option.id}
              type="button"
              onClick={() => onThemeChange(option.id)}
              className={cn(
                'flex flex-col items-center gap-3 rounded-lg border-2 p-4 transition-all',
                isSelected
                  ? 'border-primary bg-primary/5'
                  : 'border-border hover:border-primary/50'
              )}
            >
              <div className="flex gap-1">
                <div className={cn('h-6 w-6 rounded-full', option.colors.primary)} />
                <div className={cn('h-6 w-6 rounded-full', option.colors.secondary)} />
                <div className={cn('h-6 w-6 rounded-full', option.colors.accent)} />
              </div>
              <div className="flex items-center gap-2">
                <Icon className="h-4 w-4" />
                <span className="text-sm font-medium">
                  {t(`theme.options.${option.id}`)}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      <div className="flex gap-3">
        <Button variant="outline" onClick={onSkip}>
          {t('common.skip')}
        </Button>
        <Button onClick={onNext}>
          {t('common.continue')}
        </Button>
      </div>
    </div>
  );
}
