/**
 * @file StatusCard.tsx
 * @description Status card showing check-in status and deadline
 * @task TASK-013
 * @design_state_version 1.2.2
 */
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
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

interface TimeInfo {
  hours: number
  minutes: number
  isOverdue: boolean
}

function getTimeRemaining(deadlineTime: string): TimeInfo {
  const now = new Date()
  const [deadlineHours, deadlineMinutes] = deadlineTime.split(':').map(Number)
  const deadline = new Date()
  deadline.setHours(deadlineHours, deadlineMinutes, 0, 0)

  const diff = deadline.getTime() - now.getTime()
  const isOverdue = diff < 0

  const absDiff = Math.abs(diff)
  const hours = Math.floor(absDiff / (1000 * 60 * 60))
  const minutes = Math.floor((absDiff % (1000 * 60 * 60)) / (1000 * 60))

  return { hours, minutes, isOverdue }
}

// DONE(B): Added i18n support - TASK-013
export function StatusCard({ status }: StatusCardProps): JSX.Element {
  const { t } = useTranslation('dashboard')
  const [timeInfo, setTimeInfo] = useState(() => getTimeRemaining(status.deadlineTime))

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeInfo(getTimeRemaining(status.deadlineTime))
    }, 60000)

    return () => clearInterval(interval)
  }, [status.deadlineTime])

  const getTimeText = (): string => {
    const { hours, minutes, isOverdue } = timeInfo
    if (hours > 0) {
      return isOverdue
        ? t('time.hoursMinutesOverdue', { hours, minutes })
        : t('time.hoursMinutesRemaining', { hours, minutes })
    }
    return isOverdue
      ? t('time.minutesOverdue', { minutes })
      : t('time.minutesRemaining', { minutes })
  }

  if (status.hasCheckedIn && status.checkIn) {
    return (
      <Card>
        <CardContent className="pt-6 text-center">
          <p className="text-lg font-medium text-green-600">{t('status.safe')}</p>
          <p className="mt-1 text-sm text-muted-foreground">
            {t('status.checkedInAt', { time: new Date(status.checkIn.checkedInAt).toLocaleTimeString() })}
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
          {t('status.deadline', { time: formatTime(status.deadlineTime) })}
        </p>
        <p
          className={cn(
            'mt-1 text-lg font-medium',
            timeInfo.isOverdue ? 'text-red-500' : 'text-slate-700'
          )}
        >
          {getTimeText()}
        </p>
      </CardContent>
    </Card>
  )
}
