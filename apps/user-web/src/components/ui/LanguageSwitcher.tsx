/**
 * @file LanguageSwitcher.tsx
 * @description Language selection dropdown component
 * @task TASK-013
 * @design_state_version 1.2.2
 */
import { useTranslation } from 'react-i18next';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const languages = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'zh', name: '中文', flag: '🇨🇳' },
  { code: 'ja', name: '日本語', flag: '🇯🇵' },
];

/**
 * DONE(B): Implement LanguageSwitcher component - TASK-013
 *
 * Requirements:
 * - Show current language in SelectTrigger
 * - Display all languages in dropdown with flag + name
 * - On select, call i18n.changeLanguage(code)
 * - Language persists in localStorage (handled by i18n config)
 */
export function LanguageSwitcher(): JSX.Element {
  const { i18n } = useTranslation();

  const currentLanguage = languages.find((lang) => lang.code === i18n.language) || languages[0];

  const handleLanguageChange = (code: string): void => {
    i18n.changeLanguage(code);
  };

  return (
    <Select value={i18n.language} onValueChange={handleLanguageChange}>
      <SelectTrigger className="w-auto min-w-[120px] h-8 text-sm">
        <SelectValue>
          <span className="flex items-center gap-1.5">
            <span>{currentLanguage.flag}</span>
            <span>{currentLanguage.name}</span>
          </span>
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        {languages.map((lang) => (
          <SelectItem key={lang.code} value={lang.code}>
            <span className="flex items-center gap-2">
              <span>{lang.flag}</span>
              <span>{lang.name}</span>
            </span>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
