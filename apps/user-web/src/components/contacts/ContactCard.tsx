/**
 * @file ContactCard.tsx
 * @description Card component displaying a single emergency contact
 * @task TASK-016
 * @design_state_version 1.4.2
 */
import { useTranslation } from 'react-i18next'
import { Mail, Phone, Pencil, Trash2 } from 'lucide-react'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import type { EmergencyContact } from '@solo-guardian/api-client'

interface ContactCardProps {
  contact: EmergencyContact
  onEdit: () => void
  onDelete: () => void
}

/**
 * TODO(B): Implement ContactCard
 * Requirements:
 * - Show priority badge
 * - Show contact name, email, phone
 * - Show verified/active status
 * - Edit and Delete buttons
 * Acceptance:
 * - Card displays all contact info
 * - Buttons trigger callbacks
 * Constraints:
 * - Use i18n for all text
 * - Mobile responsive
 */
export function ContactCard({ contact, onEdit, onDelete }: ContactCardProps): JSX.Element {
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
            {!contact.isActive && (
              <span className="text-xs text-muted-foreground">
                ({t('inactive')})
              </span>
            )}
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
        <div className="flex items-center text-sm text-muted-foreground">
          <Mail className="mr-2 h-4 w-4" />
          {contact.email}
        </div>
        {contact.phone && (
          <div className="flex items-center text-sm text-muted-foreground">
            <Phone className="mr-2 h-4 w-4" />
            {contact.phone}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
