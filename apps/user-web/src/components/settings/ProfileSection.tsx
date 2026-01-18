/**
 * @file ProfileSection.tsx
 * @description Profile settings section with avatar upload
 */
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { AlertCircle, Loader2 } from 'lucide-react'
import { hooks } from '@/lib/api'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { AvatarUpload } from '@/components/ui/AvatarUpload'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

export function ProfileSection(): JSX.Element {
  const { t } = useTranslation('settings')
  const { t: tCommon } = useTranslation('common')

  const { data: profile, isLoading, error } = hooks.useProfile()
  const uploadMutation = hooks.useUploadAvatar()
  const updateMutation = hooks.useUpdateProfile()

  const [localName, setLocalName] = useState<string | null>(null)
  const [localBirthYear, setLocalBirthYear] = useState<number | null>(null)

  const name = localName ?? profile?.name ?? ''
  const birthYear = localBirthYear ?? profile?.birthYear ?? null

  const hasChanges =
    profile &&
    (name !== profile.name || birthYear !== profile.birthYear)

  const handleUpload = (file: File): void => {
    uploadMutation.mutate(file, {
      onError: (error) => {
        console.error('Avatar upload failed:', error)
      },
    })
  }

  const handleSave = (): void => {
    updateMutation.mutate(
      {
        name: name || undefined,
        birthYear: birthYear || undefined,
      },
      {
        onSuccess: () => {
          setLocalName(null)
          setLocalBirthYear(null)
        },
      }
    )
  }

  if (isLoading) {
    return (
      <Card>
        <CardContent className="py-8">
          <div className="flex items-center justify-center">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card>
        <CardContent className="py-8">
          <div className="flex items-center justify-center gap-2 text-destructive">
            <AlertCircle className="h-5 w-5" />
            <span>{t('profile.loadError', 'Failed to load profile')}</span>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('profile.title', 'Profile')}</CardTitle>
        <CardDescription>
          {t('profile.description', 'Manage your personal information and avatar')}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Avatar Upload */}
        <div className="flex justify-center py-4">
          <AvatarUpload
            currentAvatar={profile?.avatar}
            onUpload={handleUpload}
            isUploading={uploadMutation.isPending}
          />
        </div>

        {uploadMutation.isError && (
          <div className="flex items-center gap-2 text-sm text-destructive bg-destructive/10 p-3 rounded-md">
            <AlertCircle className="h-4 w-4" />
            <span>
              {t('profile.uploadError', 'Failed to upload avatar. Please try again.')}
            </span>
          </div>
        )}

        {uploadMutation.isSuccess && (
          <div className="text-sm text-green-600 bg-green-50 p-3 rounded-md text-center">
            {t('profile.uploadSuccess', 'Avatar uploaded successfully!')}
          </div>
        )}

        {/* Profile Form */}
        <div className="space-y-4 pt-4 border-t">
          <div className="space-y-2">
            <Label htmlFor="name">
              {t('profile.name', 'Name')}
            </Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setLocalName(e.target.value)}
              placeholder={t('profile.namePlaceholder', 'Enter your name')}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="birthYear">
              {t('profile.birthYear', 'Birth Year (Optional)')}
            </Label>
            <Input
              id="birthYear"
              type="number"
              min="1900"
              max={new Date().getFullYear()}
              value={birthYear ?? ''}
              onChange={(e) =>
                setLocalBirthYear(e.target.value ? parseInt(e.target.value) : null)
              }
              placeholder={t('profile.birthYearPlaceholder', 'e.g., 1980')}
            />
          </div>

          {/* User Info (Read-only) */}
          <div className="space-y-2 pt-2">
            <Label className="text-muted-foreground">
              {t('profile.email', 'Email')}
            </Label>
            <div className="text-sm text-muted-foreground">
              {profile?.email || t('profile.notSet', 'Not set')}
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-muted-foreground">
              {t('profile.username', 'Username')}
            </Label>
            <div className="text-sm text-muted-foreground">
              {profile?.username || t('profile.notSet', 'Not set')}
            </div>
          </div>

          {profile?.phone && (
            <div className="space-y-2">
              <Label className="text-muted-foreground">
                {t('profile.phone', 'Phone')}
              </Label>
              <div className="text-sm text-muted-foreground">
                {profile.phone}
              </div>
            </div>
          )}
        </div>

        {hasChanges && (
          <Button
            onClick={handleSave}
            disabled={updateMutation.isPending || !name.trim()}
            className="w-full"
          >
            {updateMutation.isPending ? tCommon('saving') : tCommon('save')}
          </Button>
        )}

        {updateMutation.isSuccess && !hasChanges && (
          <p className="text-center text-sm text-green-600">
            {t('profile.updateSuccess', 'Profile updated successfully!')}
          </p>
        )}
      </CardContent>
    </Card>
  )
}
