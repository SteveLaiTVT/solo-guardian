/**
 * @file ContactsPage.tsx
 * @description Emergency contacts management page
 * @task TASK-016
 * @design_state_version 1.4.2
 */
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Loader2, Plus, Users } from 'lucide-react'
import { hooks } from '@/lib/api'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardTitle } from '@/components/ui/card'
import { ContactCard } from '@/components/contacts/ContactCard'
import { ContactForm } from '@/components/contacts/ContactForm'
import { DeleteContactDialog } from '@/components/contacts/DeleteContactDialog'
import type { EmergencyContact } from '@solo-guardian/api-client'

const MAX_CONTACTS = 5

// DONE(B): Implemented ContactsPage - TASK-016
export function ContactsPage(): JSX.Element {
  const { t } = useTranslation('contacts')
  const { t: tCommon } = useTranslation('common')
  const { data: contacts, isLoading, error } = hooks.useContacts()

  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingContact, setEditingContact] = useState<EmergencyContact | null>(null)
  const [deletingContact, setDeletingContact] = useState<EmergencyContact | null>(null)

  const contactCount = contacts?.length ?? 0
  const canAddMore = contactCount < MAX_CONTACTS

  const handleAddClick = (): void => {
    setEditingContact(null)
    setIsFormOpen(true)
  }

  const handleEditClick = (contact: EmergencyContact): void => {
    setEditingContact(contact)
    setIsFormOpen(true)
  }

  const handleDeleteClick = (contact: EmergencyContact): void => {
    setDeletingContact(contact)
  }

  const handleFormClose = (): void => {
    setIsFormOpen(false)
    setEditingContact(null)
  }

  const handleDeleteClose = (): void => {
    setDeletingContact(null)
  }

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
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">{t('title')}</h1>
          <p className="text-sm text-muted-foreground">{t('subtitle')}</p>
        </div>
        <div className="text-sm text-muted-foreground">
          {t('contactCount', { count: contactCount })}
        </div>
      </div>

      {/* Add Button */}
      <Button
        onClick={handleAddClick}
        disabled={!canAddMore}
        className="w-full sm:w-auto"
      >
        <Plus className="mr-2 h-4 w-4" />
        {t('addContact')}
      </Button>

      {!canAddMore && (
        <p className="text-sm text-amber-600">{t('maxContactsReached')}</p>
      )}

      {/* Contact List or Empty State */}
      {contacts && contacts.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {contacts.map((contact) => (
            <ContactCard
              key={contact.id}
              contact={contact}
              onEdit={() => handleEditClick(contact)}
              onDelete={() => handleDeleteClick(contact)}
            />
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Users className="h-12 w-12 text-muted-foreground mb-4" />
            <CardTitle className="text-lg">{t('emptyState')}</CardTitle>
            <CardDescription className="text-center mt-2">
              {t('emptyStateHint')}
            </CardDescription>
          </CardContent>
        </Card>
      )}

      {/* Contact Form Dialog */}
      <ContactForm
        open={isFormOpen}
        contact={editingContact}
        onClose={handleFormClose}
      />

      {/* Delete Confirmation Dialog */}
      <DeleteContactDialog
        contact={deletingContact}
        onClose={handleDeleteClose}
      />
    </div>
  )
}
