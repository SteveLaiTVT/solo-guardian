/**
 * @file SettingsPage.tsx
 * @description Settings page for check-in preferences, features, visual, and account
 * @task TASK-013, TASK-022, TASK-030
 * @design_state_version 2.0.0
 */
import { useState, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useQueryClient } from '@tanstack/react-query'
import { Loader2, AlertCircle } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { hooks } from '@/lib/api'
import { useAuthStore } from '@/stores/auth.store'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { TimePicker } from '@/components/ui/TimePicker'
import { Label } from '@/components/ui/label'
import { FeaturesSection, VisualSection, ElderModeSection } from '@/components/settings'

// DONE(B): Helper to convert time string to minutes for comparison - TASK-030
function timeToMinutes(time: string): number {
  const [hours, minutes] = time.split(':').map(Number)
  return hours * 60 + minutes
}

// DONE(B): Added i18n support - TASK-013
// DONE(B): Added reminder settings validation - TASK-030
export function SettingsPage(): JSX.Element {
  const { t } = useTranslation('settings')
  const { t: tCommon } = useTranslation('common')
  const { t: tAuth } = useTranslation('auth')
  const navigate = useNavigate()
  const queryClient = useQueryClient()
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

  // DONE(B): Validate reminder time is before deadline - TASK-030
  const reminderTimeError = useMemo(() => {
    if (!reminderEnabled) return null
    if (timeToMinutes(reminderTime) >= timeToMinutes(deadline)) {
      return t('checkIn.reminderError', 'Reminder time must be before deadline')
    }
    return null
  }, [reminderTime, deadline, reminderEnabled, t])

  const handleSave = (): void => {
    if (reminderTimeError) return
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
    queryClient.clear() // Clear all cached queries to prevent data leak between users
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

          {/* DONE(B): Reminder settings section - TASK-030 */}
          <div className="border-t pt-4 mt-4">
            <h3 className="text-sm font-medium mb-3">{t('checkIn.reminderTitle', 'Reminder Settings')}</h3>

            <div className="flex items-center space-x-2 mb-3">
              <input
                type="checkbox"
                id="reminderEnabled"
                checked={reminderEnabled}
                onChange={(e) => setLocalReminderEnabled(e.target.checked)}
                className="h-4 w-4 rounded border-gray-300"
              />
              <div>
                <Label htmlFor="reminderEnabled">{t('checkIn.enableReminder')}</Label>
                <p className="text-xs text-muted-foreground">
                  {t('checkIn.enableReminderDesc', 'Receive an email reminder before your check-in deadline')}
                </p>
              </div>
            </div>

            {/* DONE(B): Conditionally show reminder time picker - TASK-030 */}
            {reminderEnabled && (
              <div className="ml-6 space-y-2">
                <TimePicker
                  id="reminder"
                  label={t('checkIn.reminder')}
                  value={reminderTime}
                  onChange={setLocalReminderTime}
                />
                {reminderTimeError && (
                  <div className="flex items-center gap-2 text-sm text-red-500">
                    <AlertCircle className="h-4 w-4" />
                    {reminderTimeError}
                  </div>
                )}
              </div>
            )}
          </div>

          {hasChanges && (
            <Button
              onClick={handleSave}
              disabled={updateMutation.isPending || !!reminderTimeError}
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

      <ElderModeSection />

      <FeaturesSection />

      <VisualSection />

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
