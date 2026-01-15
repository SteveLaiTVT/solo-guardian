import { useEffect, useState } from 'react'
import type { TodayStatus } from '@solo-guardian/api-client'
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'

interface StatusCardProps {
  status: TodayStatus
}

function formatTime(time: string): string {
  const [hours, minutes] = time.split(':').map(Number)
  const period = hours >= 12 ? 'PM' : 'AM'
  const displayHours = hours % 12 || 12
  return `${displayHours}:${minutes.toString().padStart(2, '0')} ${period}`
}

function getTimeRemaining(deadlineTime: string): { text: string; isOverdue: boolean } {
  const now = new Date()
  const [deadlineHours, deadlineMinutes] = deadlineTime.split(':').map(Number)
  const deadline = new Date()
  deadline.setHours(deadlineHours, deadlineMinutes, 0, 0)

  const diff = deadline.getTime() - now.getTime()
  const isOverdue = diff < 0

  const absDiff = Math.abs(diff)
  const hours = Math.floor(absDiff / (1000 * 60 * 60))
  const minutes = Math.floor((absDiff % (1000 * 60 * 60)) / (1000 * 60))

  if (hours > 0) {
    return {
      text: `${hours}h ${minutes}m ${isOverdue ? 'overdue' : 'remaining'}`,
      isOverdue,
    }
  }
  return {
    text: `${minutes}m ${isOverdue ? 'overdue' : 'remaining'}`,
    isOverdue,
  }
}

export function StatusCard({ status }: StatusCardProps) {
  const [timeInfo, setTimeInfo] = useState(() => getTimeRemaining(status.deadlineTime))

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeInfo(getTimeRemaining(status.deadlineTime))
    }, 60000)

    return () => clearInterval(interval)
  }, [status.deadlineTime])

  if (status.hasCheckedIn && status.checkIn) {
    return (
      <Card>
        <CardContent className="pt-6 text-center">
          <p className="text-lg font-medium text-green-600">You&apos;re safe today!</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Checked in at {new Date(status.checkIn.checkedInAt).toLocaleTimeString()}
          </p>
          {status.checkIn.note && (
            <p className="mt-2 text-sm italic text-muted-foreground">
              &quot;{status.checkIn.note}&quot;
            </p>
          )}
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardContent className="pt-6 text-center">
        <p className="text-sm text-muted-foreground">
          Deadline: {formatTime(status.deadlineTime)}
        </p>
        <p
          className={cn(
            'mt-1 text-lg font-medium',
            timeInfo.isOverdue ? 'text-red-500' : 'text-slate-700'
          )}
        >
          {timeInfo.text}
        </p>
      </CardContent>
    </Card>
  )
}
