import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"

export function LoginPage() {
  // TODO(B): Implement login form with email/password
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <div className="w-full max-w-sm space-y-6">
        <div className="space-y-2 text-center">
          <h1 className="text-2xl font-bold">Welcome back</h1>
          <p className="text-muted-foreground">
            Sign in to your account to continue
          </p>
        </div>
        <div className="space-y-4">
          {/* TODO(B): Add form fields */}
          <p className="text-center text-muted-foreground">
            Login form placeholder
          </p>
          <Button className="w-full" disabled>
            Sign in
          </Button>
        </div>
        <p className="text-center text-sm text-muted-foreground">
          Don&apos;t have an account?{" "}
          <Link to="/register" className="underline underline-offset-4 hover:text-primary">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  )
}
