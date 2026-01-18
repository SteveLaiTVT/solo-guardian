/**
 * @file Header.tsx
 * @description Application header with navigation
 * @task TASK-013, TASK-016
 * @design_state_version 1.4.2
 */
import { NavLink, Link } from "react-router-dom"
import { useTranslation } from "react-i18next"
import { Home, History, Heart, Users, Settings } from "lucide-react"
import { LanguageSwitcher } from "@/components/ui/LanguageSwitcher"
import { cn } from "@/lib/utils"

interface NavItem {
  to: string
  icon: React.ComponentType<{ className?: string }>
  labelKey: string
}

const navItems: NavItem[] = [
  { to: "/", icon: Home, labelKey: "nav.home" },
  { to: "/history", icon: History, labelKey: "nav.history" },
  { to: "/caregiver", icon: Heart, labelKey: "nav.caregiver" },
  { to: "/contacts", icon: Users, labelKey: "nav.contacts" },
  { to: "/settings", icon: Settings, labelKey: "nav.settings" },
]

export function Header(): JSX.Element {
  const { t } = useTranslation('common');

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container px-4 flex h-14 items-center">
        <Link to="/" className="flex items-center space-x-2">
          <span className="font-bold text-lg">{t('appName')}</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-1 ml-6">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === "/"}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-md transition-colors",
                  isActive
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:text-foreground hover:bg-accent"
                )
              }
            >
              <item.icon className="h-4 w-4" />
              <span>{t(item.labelKey)}</span>
            </NavLink>
          ))}
        </nav>

        <div className="flex flex-1 items-center justify-end space-x-2">
          <LanguageSwitcher />
        </div>
      </div>
    </header>
  )
}
