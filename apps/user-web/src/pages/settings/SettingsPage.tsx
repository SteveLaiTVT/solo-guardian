/**
 * @file SettingsPage.tsx
 * @description Settings page for check-in preferences and account
 * @task TASK-013
 * @design_state_version 1.2.2
 */
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Loader2 } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { hooks } from '@/lib/api'
import { useAuthStore } from '@/stores/auth.store'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { TimePicker } from '@/components/ui/TimePicker'
import { Label } from '@/components/ui/label'

// DONE(B): Added i18n support - TASK-013
export function SettingsPage(): JSX.Element {
  const { t } = useTranslation('settings')
  const { t: tCommon } = useTranslation('common')
  const { t: tAuth } = useTranslation('auth')
  const navigate = useNavigate()
  const clearTokens = useAuthStore((s) => s.clearTokens)
  const { data: settings, isLoading, error } = hooks.useSettings()
  const updateMutation = hooks.useUpdateSettings()

  // Local state for pending edits (null = use server value)
  const [localDeadline, setLocalDeadline] = useState<string | null>(null)
  const [localReminderTime, setLocalReminderTime] = useState<string | null>(null)
  const [localReminderEnabled, setLocalReminderEnabled] = useState<boolean | null>(null)

  // Derive values: use local edits if present, otherwise server values
  const deadline = localDeadline ?? settings?.deadlineTime ?? '10:00'
  const reminderTime = localReminderTime ?? settings?.reminderTime ?? '09:00'
  const reminderEnabled = localReminderEnabled ?? settings?.reminderEnabled ?? true

  const handleSave = (): void => {
    updateMutation.mutate(
      {
        deadlineTime: deadline,
        reminderTime: reminderTime,
        reminderEnabled: reminderEnabled,
      },
      {
        onSuccess: () => {
          // Reset local state after successful save
          setLocalDeadline(null)
          setLocalReminderTime(null)
          setLocalReminderEnabled(null)
        },
      }
    )
  }

  const handleLogout = (): void => {
    clearTokens()
    navigate('/login')
  }

  const hasChanges =
    settings &&
    (deadline !== settings.deadlineTime ||
      reminderTime !== settings.reminderTime ||
      reminderEnabled !== settings.reminderEnabled)

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center space-y-4">
        <p className="text-red-500">{t('error.loadFailed')}</p>
        <Button onClick={() => window.location.reload()}>{tCommon('retry')}</Button>
      </div>
    )
  }

  return (
    <div className="space-y-6 px-4 py-6">
      <h1 className="text-2xl font-bold">{t('title')}</h1>

      <Card>
        <CardHeader>
          <CardTitle>{t('checkIn.title')}</CardTitle>
          <CardDescription>{t('checkIn.description')}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <TimePicker
            id="deadline"
            label={t('checkIn.deadline')}
            value={deadline}
            onChange={setLocalDeadline}
          />

          <TimePicker
            id="reminder"
            label={t('checkIn.reminder')}
            value={reminderTime}
            onChange={setLocalReminderTime}
          />

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="reminderEnabled"
              checked={reminderEnabled}
              onChange={(e) => setLocalReminderEnabled(e.target.checked)}
              className="h-4 w-4 rounded border-gray-300"
            />
            <Label htmlFor="reminderEnabled">{t('checkIn.enableReminder')}</Label>
          </div>

          {hasChanges && (
            <Button
              onClick={handleSave}
              disabled={updateMutation.isPending}
              className="w-full"
            >
              {updateMutation.isPending ? tCommon('saving') : tCommon('save')}
            </Button>
          )}

          {updateMutation.isSuccess && !hasChanges && (
            <p className="text-center text-sm text-green-600">{t('success')}</p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{t('account.title')}</CardTitle>
          <CardDescription>{t('account.description')}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-sm text-muted-foreground">
            {tAuth('signedIn')}
          </div>
          <Button variant="destructive" onClick={handleLogout}>
            {tAuth('signOut')}
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
