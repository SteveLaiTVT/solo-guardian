/**
 * @file ContactCard.tsx
 * @description Card component displaying a single emergency contact with verification status
 * @task TASK-037, TASK-071
 * @design_state_version 3.9.0
 */
import { useTranslation } from 'react-i18next'
import { Mail, Phone, Pencil, Trash2, CheckCircle2, AlertCircle, MessageSquare, Link2 } from 'lucide-react'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import type { EmergencyContact } from '@solo-guardian/api-client'

interface ContactCardProps {
  contact: EmergencyContact
  onEdit: () => void
  onDelete: () => void
  onVerifyPhone: () => void
}

// DONE(B): Updated ContactCard with verification status - TASK-037
export function ContactCard({
  contact,
  onEdit,
  onDelete,
  onVerifyPhone,
}: ContactCardProps): JSX.Element {
  const { t } = useTranslation('contacts')

  return (
    <Card className="relative">
      {/* Priority Badge */}
      <div className="absolute -top-2 -left-2 flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-bold">
        {contact.priority}
      </div>

      <CardHeader className="pb-2 pt-4">
        <div className="flex items-start justify-between">
          <div className="pl-4">
            <h3 className="font-semibold text-lg">{contact.name}</h3>
            <div className="flex flex-wrap gap-1.5 mt-1">
              {!contact.isActive && (
                <span className="inline-flex items-center rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">
                  {t('inactive')}
                </span>
              )}
              {/* Preferred Channel Badge */}
              <span className="inline-flex items-center rounded-full bg-primary/10 px-2 py-0.5 text-xs text-primary">
                {contact.preferredChannel === 'sms' ? (
                  <>
                    <MessageSquare className="mr-1 h-3 w-3" />
                    {t('channelSms')}
                  </>
                ) : (
                  <>
                    <Mail className="mr-1 h-3 w-3" />
                    {t('channelEmail')}
                  </>
                )}
              </span>
              {/* Linked Status Badge */}
              {contact.invitationStatus === 'accepted' && (
                <span className="inline-flex items-center rounded-full bg-green-100 px-2 py-0.5 text-xs text-green-700 dark:bg-green-900/30 dark:text-green-400">
                  <Link2 className="mr-1 h-3 w-3" />
                  {t('linked.linked')}
                </span>
              )}
              {contact.invitationStatus === 'pending' && (
                <span className="inline-flex items-center rounded-full bg-amber-100 px-2 py-0.5 text-xs text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">
                  <Link2 className="mr-1 h-3 w-3" />
                  {t('linked.pending')}
                </span>
              )}
            </div>
          </div>
          <div className="flex space-x-1">
            <Button variant="ghost" size="icon" onClick={onEdit}>
              <Pencil className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={onDelete}>
              <Trash2 className="h-4 w-4 text-destructive" />
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-2">
        {/* Email with verification status */}
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center text-muted-foreground">
            <Mail className="mr-2 h-4 w-4" />
            <span className="truncate">{contact.email}</span>
          </div>
          {contact.isVerified ? (
            <span className="flex items-center text-green-600 text-xs">
              <CheckCircle2 className="mr-1 h-3 w-3" />
              {t('verified')}
            </span>
          ) : (
            <span className="flex items-center text-amber-600 text-xs">
              <AlertCircle className="mr-1 h-3 w-3" />
              {t('unverified')}
            </span>
          )}
        </div>

        {/* Phone with verification status */}
        {contact.phone && (
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center text-muted-foreground">
              <Phone className="mr-2 h-4 w-4" />
              <span>{contact.phone}</span>
            </div>
            {contact.phoneVerified ? (
              <span className="flex items-center text-green-600 text-xs">
                <CheckCircle2 className="mr-1 h-3 w-3" />
                {t('verified')}
              </span>
            ) : (
              <Button
                variant="link"
                size="sm"
                onClick={onVerifyPhone}
                className="h-auto p-0 text-xs text-amber-600 hover:text-amber-700"
              >
                <AlertCircle className="mr-1 h-3 w-3" />
                {t('verifyPhone')}
              </Button>
            )}
          </div>
        )}

        {/* Warning if SMS preferred but phone not verified */}
        {contact.preferredChannel === 'sms' && !contact.phoneVerified && (
          <p className="text-xs text-amber-600 bg-amber-50 dark:bg-amber-950/20 p-2 rounded">
            {t('smsRequiresVerifiedPhone')}
          </p>
        )}
      </CardContent>
    </Card>
  )
}
