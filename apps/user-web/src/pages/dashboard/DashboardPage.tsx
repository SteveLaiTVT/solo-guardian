import { Button } from "@/components/ui/button"

export function DashboardPage() {
  // TODO(B): Implement check-in button and today's status
  return (
    <div className="flex flex-col items-center justify-center space-y-8 py-12">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold">Good morning!</h1>
        <p className="text-muted-foreground">
          Tap the button below to check in for today
        </p>
      </div>
      <Button size="lg" className="h-32 w-32 rounded-full text-xl" disabled>
        Check In
      </Button>
      <p className="text-sm text-muted-foreground">
        Deadline: 10:00 AM
      </p>
    </div>
  )
}
