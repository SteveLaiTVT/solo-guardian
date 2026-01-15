/**
 * @file MobileNav.tsx
 * @description Mobile bottom navigation component
 * @task TASK-013
 * @design_state_version 1.2.2
 */
import { NavLink } from "react-router-dom"
import { useTranslation } from "react-i18next"
import { Home, History, Settings } from "lucide-react"
import { cn } from "@/lib/utils"

interface NavItem {
  to: string
  icon: React.ComponentType<{ className?: string }>
  labelKey: string
}

const navItems: NavItem[] = [
  { to: "/", icon: Home, labelKey: "nav.home" },
  { to: "/history", icon: History, labelKey: "nav.history" },
  { to: "/settings", icon: Settings, labelKey: "nav.settings" },
]

// DONE(B): Added i18n support - TASK-013
export function MobileNav(): JSX.Element {
  const { t } = useTranslation('common')

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t bg-background md:hidden">
      <div className="flex h-16 items-center justify-around">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              cn(
                "flex flex-col items-center justify-center gap-1 px-3 py-2 text-xs",
                isActive
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
              )
            }
          >
            <item.icon className="h-5 w-5" />
            <span>{t(item.labelKey)}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  )
}
