/**
 * @file DeleteContactDialog.tsx
 * @description Confirmation dialog for deleting an emergency contact
 * @task TASK-016
 * @design_state_version 1.4.2
 */
import { useTranslation } from 'react-i18next'
import { Loader2, AlertTriangle } from 'lucide-react'
import { hooks } from '@/lib/api'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import type { EmergencyContact } from '@solo-guardian/api-client'

interface DeleteContactDialogProps {
  contact: EmergencyContact | null
  onClose: () => void
}

/**
 * TODO(B): Implement DeleteContactDialog
 * Requirements:
 * - Show confirmation message with contact name
 * - Cancel and Delete buttons
 * - Call delete API on confirm
 * - Close dialog on success
 * Acceptance:
 * - Shows when contact is not null
 * - Deletes contact and closes on confirm
 * Constraints:
 * - Use i18n for all text
 * - Delete button should be destructive style
 */
export function DeleteContactDialog({ contact, onClose }: DeleteContactDialogProps): JSX.Element {
  const { t } = useTranslation('contacts')
  const { t: tCommon } = useTranslation('common')

  const deleteMutation = hooks.useDeleteContact()

  const handleDelete = (): void => {
    if (!contact) return

    deleteMutation.mutate(contact.id, {
      onSuccess: () => {
        onClose()
      },
    })
  }

  return (
    <Dialog open={contact !== null} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <div className="flex items-center space-x-2">
            <AlertTriangle className="h-5 w-5 text-destructive" />
            <DialogTitle>{t('deleteContact')}</DialogTitle>
          </div>
          <DialogDescription>
            {t('deleteConfirm', { name: contact?.name ?? '' })}
          </DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={deleteMutation.isPending}>
            {tCommon('cancel')}
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={deleteMutation.isPending}
          >
            {deleteMutation.isPending ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : null}
            {tCommon('delete')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
