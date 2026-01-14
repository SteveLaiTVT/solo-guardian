import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"

export function RegisterPage() {
  // TODO(B): Implement registration form
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <div className="w-full max-w-sm space-y-6">
        <div className="space-y-2 text-center">
          <h1 className="text-2xl font-bold">Create an account</h1>
          <p className="text-muted-foreground">
            Enter your details to get started
          </p>
        </div>
        <div className="space-y-4">
          {/* TODO(B): Add form fields */}
          <p className="text-center text-muted-foreground">
            Registration form placeholder
          </p>
          <Button className="w-full" disabled>
            Create account
          </Button>
        </div>
        <p className="text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link to="/login" className="underline underline-offset-4 hover:text-primary">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}
