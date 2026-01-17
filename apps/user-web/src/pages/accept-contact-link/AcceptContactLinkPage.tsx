/**
 * @file AcceptContactLinkPage.tsx
 * @description Page for accepting contact link invitation
 * @task TASK-073
 * @design_state_version 3.9.0
 */
import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Loader2, CheckCircle2, XCircle, Link2 } from 'lucide-react'
import { toast } from 'sonner'
import { hooks } from '@/lib/api'
import { useAuthStore } from '@/stores/auth.store'
import { Card, CardContent, CardDescription, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export function AcceptContactLinkPage(): JSX.Element {
  const { token } = useParams<{ token: string }>()
  const navigate = useNavigate()
  const { t } = useTranslation('contacts')
  const { t: tCommon } = useTranslation('common')
  const { isAuthenticated } = useAuthStore()

  const [status, setStatus] = useState<'loading' | 'ready' | 'success' | 'error'>('loading')
  const [errorMessage, setErrorMessage] = useState<string>('')

  const { data: invitation, isLoading, error } = hooks.useContactLinkInvitation(token ?? '')
  const acceptMutation = hooks.useAcceptContactLink()

  useEffect(() => {
    if (isLoading) {
      setStatus('loading')
    } else if (error) {
      setStatus('error')
      setErrorMessage('Invalid or expired invitation')
    } else if (invitation) {
      setStatus('ready')
    }
  }, [isLoading, error, invitation])

  const handleAccept = async (): Promise<void> => {
    if (!token) return

    try {
      const result = await acceptMutation.mutateAsync(token)
      setStatus('success')
      toast.success(t('linked.acceptSuccess', { name: result.elderName }))
    } catch {
      setStatus('error')
      setErrorMessage(t('linked.acceptError'))
    }
  }

  const handleGoToLinked = (): void => {
    navigate('/contacts/linked')
  }

  const handleLogin = (): void => {
    navigate(`/login?redirect=/accept-contact-link/${token}`)
  }

  if (status === 'loading') {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-primary/10 to-primary/5">
        <Card className="w-full max-w-md mx-4">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
            <p className="text-muted-foreground">{tCommon('loading')}</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (status === 'error') {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-primary/10 to-primary/5">
        <Card className="w-full max-w-md mx-4">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <XCircle className="h-12 w-12 text-red-500 mb-4" />
            <CardTitle className="text-lg mb-2">Error</CardTitle>
            <CardDescription className="text-center">{errorMessage}</CardDescription>
            <Button onClick={() => navigate('/')} className="mt-6">
              {tCommon('backToHome')}
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (status === 'success') {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-primary/10 to-primary/5">
        <Card className="w-full max-w-md mx-4">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <CheckCircle2 className="h-12 w-12 text-green-500 mb-4" />
            <CardTitle className="text-lg mb-2">Connected!</CardTitle>
            <CardDescription className="text-center mb-6">
              {t('linked.acceptSuccess', { name: invitation?.elderName })}
            </CardDescription>
            <Button onClick={handleGoToLinked}>
              View Connected Accounts
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!isAuthenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-primary/10 to-primary/5">
        <Card className="w-full max-w-md mx-4">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Link2 className="h-12 w-12 text-primary mb-4" />
            <CardTitle className="text-lg mb-2">
              {t('linked.invitationFrom', { name: invitation?.elderName })}
            </CardTitle>
            <CardDescription className="text-center mb-6">
              Please log in to accept this invitation
            </CardDescription>
            <Button onClick={handleLogin}>
              Log In to Accept
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-primary/10 to-primary/5">
      <Card className="w-full max-w-md mx-4">
        <CardContent className="flex flex-col items-center justify-center py-12">
          <Link2 className="h-12 w-12 text-primary mb-4" />
          <CardTitle className="text-lg mb-2">
            {t('linked.invitationFrom', { name: invitation?.elderName })}
          </CardTitle>
          <CardDescription className="text-center mb-2">
            {invitation?.elderEmail}
          </CardDescription>
          <p className="text-sm text-center text-muted-foreground mb-6">
            {t('linked.invitationDescription')}
          </p>
          <Button
            onClick={handleAccept}
            disabled={acceptMutation.isPending}
            className="w-full"
          >
            {acceptMutation.isPending ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <CheckCircle2 className="mr-2 h-4 w-4" />
            )}
            {t('linked.acceptInvitation')}
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
