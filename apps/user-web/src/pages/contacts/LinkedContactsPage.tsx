/**
 * @file LinkedContactsPage.tsx
 * @description Page showing people who have added the current user as emergency contact
 * @task TASK-072
 * @design_state_version 3.9.0
 */
import { useTranslation } from 'react-i18next'
import { Loader2, Users, AlertTriangle, Check } from 'lucide-react'
import { toast } from 'sonner'
import { hooks } from '@/lib/api'
import { Card, CardContent, CardDescription, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
const formatDate = (dateString: string): string => {
  return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).format(new Date(dateString))
}

function LinkedContactsPage(): JSX.Element {
  const { t } = useTranslation('contacts')
  const { t: tCommon } = useTranslation('common')

  const {
    data: linkedContacts,
    isLoading: isLoadingLinked,
    error: linkedError,
    refetch: refetchLinked,
  } = hooks.useLinkedContacts()

  const {
    data: pendingInvitations,
    isLoading: isLoadingPending,
    refetch: refetchPending,
  } = hooks.usePendingContactInvitations()

  const acceptMutation = hooks.useAcceptContactLink()

  const handleAcceptInvitation = async (contactId: string, elderName: string): Promise<void> => {
    try {
      await acceptMutation.mutateAsync(contactId)
      toast.success(t('linked.acceptSuccess', { name: elderName }))
      void refetchLinked()
      void refetchPending()
    } catch {
      toast.error(t('linked.acceptError'))
    }
  }

  const isLoading = isLoadingLinked || isLoadingPending

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (linkedError) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center space-y-4">
        <p className="text-red-500">{t('error.loadFailed')}</p>
        <Button onClick={() => window.location.reload()}>{tCommon('retry')}</Button>
      </div>
    )
  }

  const hasPendingInvitations = (pendingInvitations?.length ?? 0) > 0
  const hasLinkedContacts = (linkedContacts?.length ?? 0) > 0

  return (
    <div className="space-y-6 px-4 py-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">{t('linked.title')}</h1>
        <p className="text-sm text-muted-foreground">{t('linked.subtitle')}</p>
      </div>

      {/* Pending Invitations */}
      {hasPendingInvitations && (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">{t('linked.pendingInvitations')}</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {pendingInvitations!.map((invitation) => (
              <Card key={invitation.id} className="border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-950/20">
                <CardContent className="p-4">
                  <div className="space-y-3">
                    <div>
                      <p className="font-semibold">{invitation.elderName}</p>
                      <p className="text-sm text-muted-foreground">{invitation.elderEmail}</p>
                    </div>
                    <p className="text-sm">
                      {t('linked.invitationFrom', { name: invitation.elderName })}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {t('linked.invitedAt', { date: formatDate(invitation.invitedAt) })}
                    </p>
                    <Button
                      onClick={() => handleAcceptInvitation(invitation.id, invitation.elderName)}
                      disabled={acceptMutation.isPending}
                      className="w-full"
                    >
                      <Check className="mr-2 h-4 w-4" />
                      {t('linked.acceptInvitation')}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Linked Contacts */}
      {hasLinkedContacts ? (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">
            {hasPendingInvitations ? t('linked.title') : ''}
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {linkedContacts!.map((contact) => (
              <Card key={contact.id}>
                <CardContent className="p-4">
                  <div className="space-y-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-semibold">{contact.elderName}</p>
                        <p className="text-sm text-muted-foreground">{contact.elderEmail}</p>
                      </div>
                      {contact.hasActiveAlerts && (
                        <span className="inline-flex items-center rounded-full bg-red-100 px-2 py-0.5 text-xs text-red-700 dark:bg-red-900/30 dark:text-red-400">
                          <AlertTriangle className="mr-1 h-3 w-3" />
                          {t('linked.activeAlert')}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {t('linked.invitationDescription')}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {t('linked.relationshipSince', { date: formatDate(contact.relationshipSince) })}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      ) : !hasPendingInvitations && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Users className="h-12 w-12 text-muted-foreground mb-4" />
            <CardTitle className="text-lg">{t('linked.emptyState')}</CardTitle>
            <CardDescription className="text-center mt-2">
              {t('linked.emptyStateHint')}
            </CardDescription>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

export default LinkedContactsPage
