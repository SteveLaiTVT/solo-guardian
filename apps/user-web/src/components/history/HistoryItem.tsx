import { Check } from 'lucide-react'
import type { CheckIn } from '@solo-guardian/api-client'

interface HistoryItemProps {
  checkIn: CheckIn
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr)
  const today = new Date()
  const yesterday = new Date(today)
  yesterday.setDate(yesterday.getDate() - 1)

  if (date.toDateString() === today.toDateString()) {
    return 'Today'
  }
  if (date.toDateString() === yesterday.toDateString()) {
    return 'Yesterday'
  }

  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  })
}

function formatTime(dateStr: string): string {
  return new Date(dateStr).toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  })
}

export function HistoryItem({ checkIn }: HistoryItemProps) {
  return (
    <div className="flex items-start space-x-3 rounded-lg border p-4">
      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100">
        <Check className="h-4 w-4 text-green-600" />
      </div>
      <div className="flex-1 space-y-1">
        <div className="flex items-center justify-between">
          <span className="font-medium">{formatDate(checkIn.checkInDate)}</span>
          <span className="text-sm text-muted-foreground">
            {formatTime(checkIn.checkedInAt)}
          </span>
        </div>
        {checkIn.note && (
          <p className="text-sm text-muted-foreground">{checkIn.note}</p>
        )}
      </div>
    </div>
  )
}
