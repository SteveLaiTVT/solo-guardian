/**
 * @file Header.tsx
 * @description Application header with navigation
 * @task TASK-013, TASK-016
 * @design_state_version 1.4.2
 */
import { Link } from "react-router-dom"
import { useTranslation } from "react-i18next"
import { User, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { LanguageSwitcher } from "@/components/ui/LanguageSwitcher"

export function Header(): JSX.Element {
  const { t } = useTranslation('common');

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <Link to="/" className="flex items-center space-x-2">
          <span className="font-bold text-lg">{t('appName')}</span>
        </Link>
        <div className="flex flex-1 items-center justify-end space-x-2">
          <LanguageSwitcher />
          <Button variant="ghost" size="icon" asChild>
            <Link to="/contacts">
              <Users className="h-5 w-5" />
              <span className="sr-only">{t('nav.contacts')}</span>
            </Link>
          </Button>
          <Button variant="ghost" size="icon" asChild>
            <Link to="/settings">
              <User className="h-5 w-5" />
              <span className="sr-only">{t('nav.settings')}</span>
            </Link>
          </Button>
        </div>
      </div>
    </header>
  )
}
