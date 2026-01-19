/**
 * @file DashboardPage.tsx
 * @description Main dashboard with check-in functionality
 * @task TASK-013
 * @design_state_version 1.2.2
 */
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Loader2 } from 'lucide-react'
import { hooks } from '@/lib/api'
import { CheckInButton, StatusCard } from '@/components/check-in'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

// DONE(B): Added i18n support - TASK-013
function useGreeting(): string {
  const { t } = useTranslation('common')
  const hour = new Date().getHours()
  if (hour < 12) return t('greeting.morning')
  if (hour < 18) return t('greeting.afternoon')
  return t('greeting.evening')
}

function DashboardPage(): JSX.Element {
  const { t } = useTranslation('dashboard')
  const { t: tCommon } = useTranslation('common')
  const greeting = useGreeting()
  const [note, setNote] = useState('')
  const [showNoteInput, setShowNoteInput] = useState(false)

  const { data: todayStatus, isLoading, error } = hooks.useCheckInToday()
  const checkInMutation = hooks.useCreateCheckIn()

  const handleCheckIn = (): void => {
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
        <p className="text-red-500">{t('error.loadFailed')}</p>
        <Button onClick={() => window.location.reload()}>{tCommon('retry')}</Button>
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
        <h1 className="text-3xl font-bold">{greeting}</h1>
        <p className="text-muted-foreground">
          {todayStatus.hasCheckedIn
            ? t('status.alreadyCheckedIn')
            : t('status.tapToCheckIn')}
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
                placeholder={t('note.placeholder')}
                value={note}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNote(e.target.value)}
              />
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowNoteInput(false)}
                className="w-full"
              >
                {tCommon('cancel')}
              </Button>
            </div>
          ) : (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowNoteInput(true)}
              className="w-full"
            >
              {t('note.addNote')}
            </Button>
          )}
        </div>
      )}
    </div>
  )
}

export default DashboardPage
