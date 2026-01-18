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

function AppLogo({ className }: { className?: string }): JSX.Element {
  return (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Shield shape */}
      <path
        d="M16 2L4 7V14.5C4 21.956 9.048 28.852 16 30C22.952 28.852 28 21.956 28 14.5V7L16 2Z"
        className="fill-primary"
      />
      {/* Heart inside */}
      <path
        d="M16 24C16 24 22 19.5 22 14.5C22 12.567 20.433 11 18.5 11C17.34 11 16.32 11.58 16 12.5C15.68 11.58 14.66 11 13.5 11C11.567 11 10 12.567 10 14.5C10 19.5 16 24 16 24Z"
        className="fill-primary-foreground"
      />
    </svg>
  )
}

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
        <Link to="/" className="flex items-center gap-2">
          <AppLogo className="h-8 w-8" />
          <span className="font-semibold text-lg text-foreground">{t('appName')}</span>
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
