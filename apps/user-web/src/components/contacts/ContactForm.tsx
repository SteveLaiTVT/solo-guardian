/**
 * @file ContactForm.tsx
 * @description Dialog form for adding/editing emergency contacts with notification preference
 * @task TASK-037
 * @design_state_version 3.4.0
 */
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Loader2 } from 'lucide-react'
import { hooks } from '@/lib/api'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import type { EmergencyContact, NotificationChannel } from '@solo-guardian/api-client'

interface ContactFormProps {
  open: boolean
  contact: EmergencyContact | null
  onClose: () => void
}

// DONE(B): Updated ContactForm with notification preference - TASK-037
export function ContactForm({ open, contact, onClose }: ContactFormProps): JSX.Element {
  const { t } = useTranslation('contacts')
  const { t: tCommon } = useTranslation('common')

  const createMutation = hooks.useCreateContact()
  const updateMutation = hooks.useUpdateContact()

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [preferredChannel, setPreferredChannel] = useState<NotificationChannel>('email')
  const [errors, setErrors] = useState<Record<string, string>>({})

  const isEditing = contact !== null
  const isPending = createMutation.isPending || updateMutation.isPending
  const canSelectSms = phone.trim().length > 0

  // Reset form when dialog opens/closes or contact changes
  useEffect(() => {
    if (open) {
      queueMicrotask(() => {
        setName(contact?.name ?? '')
        setEmail(contact?.email ?? '')
        setPhone(contact?.phone ?? '')
        setPreferredChannel(contact?.preferredChannel ?? 'email')
        setErrors({})
      })
    }
  }, [open, contact])

  // Handle phone field change - reset to email if SMS was selected but phone cleared
  const handlePhoneChange = (value: string): void => {
    setPhone(value)
    // If phone is being cleared and SMS was selected, switch to email
    if (!value.trim() && preferredChannel === 'sms') {
      setPreferredChannel('email')
    }
  }

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!name.trim()) {
      newErrors.name = t('errors.nameRequired')
    }

    if (!email.trim()) {
      newErrors.email = t('errors.emailRequired')
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = t('errors.emailInvalid')
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (): void => {
    if (!validate()) return

    const data = {
      name,
      email,
      phone: phone || undefined,
      preferredChannel,
    }

    if (isEditing && contact) {
      updateMutation.mutate(
        { id: contact.id, data },
        { onSuccess: () => onClose() }
      )
    } else {
      createMutation.mutate(data, { onSuccess: () => onClose() })
    }
  }

  return (
    <Dialog open={open} onOpenChange={(isOpen: boolean) => !isOpen && onClose()}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? t('editContact') : t('addContact')}
          </DialogTitle>
          <DialogDescription>
            {isEditing ? t('editContactDescription') : t('addContactDescription')}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="name">{t('form.name')}</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={t('form.namePlaceholder')}
            />
            {errors.name && (
              <p className="text-sm text-destructive">{errors.name}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">{t('form.email')}</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t('form.emailPlaceholder')}
            />
            {errors.email && (
              <p className="text-sm text-destructive">{errors.email}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">{t('form.phone')}</Label>
            <Input
              id="phone"
              type="tel"
              value={phone}
              onChange={(e) => handlePhoneChange(e.target.value)}
              placeholder={t('form.phonePlaceholder')}
            />
            <p className="text-xs text-muted-foreground">
              {t('form.phoneHint')}
            </p>
          </div>

          {/* Notification Preference */}
          <div className="space-y-3">
            <Label>{t('form.notificationPreference')}</Label>
            <RadioGroup
              value={preferredChannel}
              onValueChange={(value) => setPreferredChannel(value as NotificationChannel)}
              className="flex flex-col space-y-2"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="email" id="channel-email" />
                <Label htmlFor="channel-email" className="font-normal cursor-pointer">
                  {t('form.channelEmail')}
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="sms" id="channel-sms" disabled={!canSelectSms} />
                <Label
                  htmlFor="channel-sms"
                  className={`font-normal cursor-pointer ${!canSelectSms ? 'text-muted-foreground' : ''}`}
                >
                  {t('form.channelSms')}
                  {!canSelectSms && (
                    <span className="ml-1 text-xs">({t('form.smsRequiresPhone')})</span>
                  )}
                </Label>
              </div>
            </RadioGroup>
            {preferredChannel === 'sms' && (
              <p className="text-xs text-muted-foreground">
                {t('form.smsVerificationNote')}
              </p>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isPending}>
            {tCommon('cancel')}
          </Button>
          <Button onClick={handleSubmit} disabled={isPending}>
            {isPending ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : null}
            {tCommon('save')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
