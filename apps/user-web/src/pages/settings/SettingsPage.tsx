import { useEffect, useState } from 'react'
import { Loader2 } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { hooks } from '@/lib/api'
import { useAuthStore } from '@/stores/auth.store'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { TimePicker } from '@/components/ui/TimePicker'
import { Label } from '@/components/ui/label'

export function SettingsPage() {
  const navigate = useNavigate()
  const clearTokens = useAuthStore((s) => s.clearTokens)
  const { data: settings, isLoading, error } = hooks.useSettings()
  const updateMutation = hooks.useUpdateSettings()

  const [deadline, setDeadline] = useState('10:00')
  const [reminderTime, setReminderTime] = useState('09:00')
  const [reminderEnabled, setReminderEnabled] = useState(true)

  useEffect(() => {
    if (settings) {
      setDeadline(settings.deadlineTime)
      setReminderTime(settings.reminderTime)
      setReminderEnabled(settings.reminderEnabled)
    }
  }, [settings])

  const handleSave = () => {
    updateMutation.mutate({
      deadlineTime: deadline,
      reminderTime: reminderTime,
      reminderEnabled: reminderEnabled,
    })
  }

  const handleLogout = () => {
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
        <p className="text-red-500">Failed to load settings</p>
        <Button onClick={() => window.location.reload()}>Retry</Button>
      </div>
    )
  }

  return (
    <div className="space-y-6 px-4 py-6">
      <h1 className="text-2xl font-bold">Settings</h1>

      <Card>
        <CardHeader>
          <CardTitle>Check-in Settings</CardTitle>
          <CardDescription>Configure your daily check-in preferences</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <TimePicker
            id="deadline"
            label="Daily Deadline"
            value={deadline}
            onChange={setDeadline}
          />

          <TimePicker
            id="reminder"
            label="Reminder Time"
            value={reminderTime}
            onChange={setReminderTime}
          />

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="reminderEnabled"
              checked={reminderEnabled}
              onChange={(e) => setReminderEnabled(e.target.checked)}
              className="h-4 w-4 rounded border-gray-300"
            />
            <Label htmlFor="reminderEnabled">Enable daily reminders</Label>
          </div>

          {hasChanges && (
            <Button
              onClick={handleSave}
              disabled={updateMutation.isPending}
              className="w-full"
            >
              {updateMutation.isPending ? 'Saving...' : 'Save Changes'}
            </Button>
          )}

          {updateMutation.isSuccess && !hasChanges && (
            <p className="text-center text-sm text-green-600">Settings saved!</p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Account</CardTitle>
          <CardDescription>Manage your account settings</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-sm text-muted-foreground">
            Signed in
          </div>
          <Button variant="destructive" onClick={handleLogout}>
            Sign out
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
