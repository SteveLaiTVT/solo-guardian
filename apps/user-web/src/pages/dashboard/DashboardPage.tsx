import { useState } from 'react'
import { Loader2 } from 'lucide-react'
import { hooks } from '@/lib/api'
import { CheckInButton, StatusCard } from '@/components/check-in'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

function getGreeting(): string {
  const hour = new Date().getHours()
  if (hour < 12) return 'Good morning!'
  if (hour < 18) return 'Good afternoon!'
  return 'Good evening!'
}

export function DashboardPage() {
  const [note, setNote] = useState('')
  const [showNoteInput, setShowNoteInput] = useState(false)

  const { data: todayStatus, isLoading, error } = hooks.useCheckInToday()
  const checkInMutation = hooks.useCreateCheckIn()

  const handleCheckIn = () => {
    checkInMutation.mutate(note ? { note } : undefined, {
      onSuccess: () => {
        setNote('')
        setShowNoteInput(false)
      },
    })
  }

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (error || !todayStatus) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center space-y-4">
        <p className="text-red-500">Failed to load status</p>
        <Button onClick={() => window.location.reload()}>Retry</Button>
      </div>
    )
  }

  const getStatus = (): 'pending' | 'overdue' | 'completed' => {
    if (todayStatus.hasCheckedIn) return 'completed'
    return todayStatus.isOverdue ? 'overdue' : 'pending'
  }

  return (
    <div className="flex flex-col items-center space-y-8 px-4 py-8">
      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-bold">{getGreeting()}</h1>
        <p className="text-muted-foreground">
          {todayStatus.hasCheckedIn
            ? "You've already checked in today"
            : 'Tap the button below to check in'}
        </p>
      </div>

      <CheckInButton
        status={getStatus()}
        onCheckIn={handleCheckIn}
        isLoading={checkInMutation.isPending}
      />

      <StatusCard status={todayStatus} />

      {!todayStatus.hasCheckedIn && (
        <div className="w-full max-w-sm space-y-2">
          {showNoteInput ? (
            <div className="space-y-2">
              <Input
                placeholder="Add a note (optional)"
                value={note}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNote(e.target.value)}
              />
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowNoteInput(false)}
                className="w-full"
              >
                Cancel
              </Button>
            </div>
          ) : (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowNoteInput(true)}
              className="w-full"
            >
              + Add a note
            </Button>
          )}
        </div>
      )}
    </div>
  )
}
