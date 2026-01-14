import { Button } from "@/components/ui/button"

export function SettingsPage() {
  // TODO(B): Implement settings form for deadline, reminder, etc.
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Settings</h1>
      <div className="space-y-4">
        <div className="rounded-lg border p-4 space-y-2">
          <h2 className="font-semibold">Check-in Settings</h2>
          <p className="text-sm text-muted-foreground">
            Configure your daily check-in preferences
          </p>
          {/* TODO(B): Add settings form fields */}
        </div>
        <div className="rounded-lg border p-4 space-y-2">
          <h2 className="font-semibold">Account</h2>
          <Button variant="destructive" size="sm" disabled>
            Sign out
          </Button>
        </div>
      </div>
    </div>
  )
}
