/**
 * @file ContactForm.tsx
 * @description Dialog form for adding/editing emergency contacts
 * @task TASK-016
 * @design_state_version 1.4.2
 */
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Loader2 } from 'lucide-react'
import { hooks } from '@/lib/api'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import type { EmergencyContact } from '@solo-guardian/api-client'

interface ContactFormProps {
  open: boolean
  contact: EmergencyContact | null
  onClose: () => void
}

// DONE(B): Implemented ContactForm - TASK-016
export function ContactForm({ open, contact, onClose }: ContactFormProps): JSX.Element {
  const { t } = useTranslation('contacts')
  const { t: tCommon } = useTranslation('common')

  const createMutation = hooks.useCreateContact()
  const updateMutation = hooks.useUpdateContact()

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [errors, setErrors] = useState<Record<string, string>>({})

  const isEditing = contact !== null
  const isPending = createMutation.isPending || updateMutation.isPending

  // Reset form when dialog opens/closes or contact changes
  useEffect(() => {
    if (open) {
      // Batch state updates for form reset - this is intentional for dialog initialization
      queueMicrotask(() => {
        setName(contact?.name ?? '')
        setEmail(contact?.email ?? '')
        setPhone(contact?.phone ?? '')
        setErrors({})
      })
    }
  }, [open, contact])

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

    if (isEditing && contact) {
      updateMutation.mutate(
        { id: contact.id, data: { name, email, phone: phone || undefined } },
        {
          onSuccess: () => {
            onClose()
          },
        }
      )
    } else {
      createMutation.mutate(
        { name, email, phone: phone || undefined },
        {
          onSuccess: () => {
            onClose()
          },
        }
      )
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
              onChange={(e) => setPhone(e.target.value)}
              placeholder={t('form.phonePlaceholder')}
            />
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
