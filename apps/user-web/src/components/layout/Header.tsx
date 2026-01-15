import { Link } from "react-router-dom"
import { User } from "lucide-react"
import { Button } from "@/components/ui/button"

export function Header() {
  // TODO(B): Add user menu dropdown with logout
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <Link to="/" className="flex items-center space-x-2">
          <span className="font-bold text-lg">Solo Guardian</span>
        </Link>
        <div className="flex flex-1 items-center justify-end space-x-2">
          <Button variant="ghost" size="icon" asChild>
            <Link to="/settings">
              <User className="h-5 w-5" />
              <span className="sr-only">Settings</span>
            </Link>
          </Button>
        </div>
      </div>
    </header>
  )
}
