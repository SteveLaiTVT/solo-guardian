export function HistoryPage() {
  // TODO(B): Implement check-in history list
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Check-in History</h1>
      <p className="text-muted-foreground">
        Your recent check-in records will appear here.
      </p>
      <div className="rounded-lg border p-4 text-center text-muted-foreground">
        No check-ins yet
      </div>
    </div>
  )
}
