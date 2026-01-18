/**
 * @file ProfileStep.tsx
 * @description Profile information step for onboarding (birth year)
 */
import { useTranslation } from 'react-i18next';
import { User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface ProfileStepProps {
  birthYear: number | null;
  onBirthYearChange: (year: number | null) => void;
  onNext: () => void;
  onSkip: () => void;
}

export function ProfileStep({
  birthYear,
  onBirthYearChange,
  onNext,
  onSkip,
}: ProfileStepProps): JSX.Element {
  const { t } = useTranslation('onboarding');

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 100 }, (_, i) => currentYear - i - 18);

  const handleYearChange = (value: string): void => {
    if (value === 'skip') {
      onBirthYearChange(null);
    } else {
      onBirthYearChange(parseInt(value, 10));
    }
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-8 text-center">
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
        <User className="h-10 w-10 text-primary" />
      </div>

      <div className="space-y-3">
        <h2 className="text-2xl font-bold">{t('profile.title')}</h2>
        <p className="text-muted-foreground">{t('profile.subtitle')}</p>
      </div>

      <div className="w-full max-w-xs space-y-4">
        <div className="space-y-2">
          <Label htmlFor="birthYear">{t('profile.birthYear')}</Label>
          <Select
            value={birthYear?.toString() ?? ''}
            onValueChange={handleYearChange}
          >
            <SelectTrigger id="birthYear">
              <SelectValue placeholder={t('profile.selectYear')} />
            </SelectTrigger>
            <SelectContent>
              {years.map((year) => (
                <SelectItem key={year} value={year.toString()}>
                  {year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <p className="text-xs text-muted-foreground">
            {t('profile.birthYearHint')}
          </p>
        </div>
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
