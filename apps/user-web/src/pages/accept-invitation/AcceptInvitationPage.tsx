/**
 * @file AcceptInvitationPage.tsx
 * @description Page for accepting caregiver/family/caretaker invitations
 * @task TASK-062
 * @design_state_version 3.8.0
 */
import { useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { UserCheck, UserX, Loader2, AlertCircle, CheckCircle, LogIn } from 'lucide-react';
import { toast } from 'sonner';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { hooks } from '@/lib/api';
import { useAuthStore } from '@/stores/auth.store';

function AcceptInvitationPage(): JSX.Element {
  const { token } = useParams<{ token: string }>();
  const { t } = useTranslation('caregiver');
  const navigate = useNavigate();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  const { data: invitation, isLoading, error } = hooks.useInvitation(token || '');
  const acceptInvitation = hooks.useAcceptInvitation();

  useEffect(() => {
    if (error) {
      toast.error(t('accept.error', 'Failed to load invitation'));
    }
  }, [error, t]);

  const handleAccept = async (): Promise<void> => {
    if (!token) return;
    try {
      await acceptInvitation.mutateAsync(token);
      toast.success(t('accept.success'));
      navigate('/');
    } catch {
      toast.error(t('accept.error', 'Failed to accept invitation'));
    }
  };

  const handleDecline = (): void => {
    navigate('/');
  };

  const getRelationshipLabel = (type: string): string => {
    switch (type) {
      case 'caregiver':
        return t('invitation.types.caregiver');
      case 'family':
        return t('invitation.types.family');
      case 'caretaker':
        return t('invitation.types.caretaker');
      default:
        return type;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!token || error || !invitation) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <CardTitle>{t('accept.invalidTitle', 'Invalid Invitation')}</CardTitle>
            <CardDescription>
              {t('accept.invalidDescription', 'This invitation link is invalid or has expired.')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full" onClick={() => navigate('/')}>
              {t('common:goHome', 'Go Home')}
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (invitation.isExpired) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <AlertCircle className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
            <CardTitle>{t('accept.expiredTitle', 'Invitation Expired')}</CardTitle>
            <CardDescription>{t('accept.expired')}</CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full" onClick={() => navigate('/')}>
              {t('common:goHome', 'Go Home')}
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (invitation.isAccepted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
            <CardTitle>{t('accept.alreadyAcceptedTitle', 'Already Accepted')}</CardTitle>
            <CardDescription>{t('accept.alreadyAccepted')}</CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full" onClick={() => navigate('/')}>
              {t('common:goHome', 'Go Home')}
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <LogIn className="h-12 w-12 text-primary mx-auto mb-4" />
            <CardTitle>{t('accept.title')}</CardTitle>
            <CardDescription>
              {t('accept.invitedBy', { name: invitation.inviter.name })}
              <br />
              {t('accept.relationshipType', { type: getRelationshipLabel(invitation.relationshipType) })}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-center text-muted-foreground">
              {t('accept.loginRequired')}
            </p>
            <div className="flex gap-2">
              <Button asChild className="flex-1">
                <Link to={`/login?redirect=/accept-invitation/${token}`}>
                  {t('auth:login', 'Log In')}
                </Link>
              </Button>
              <Button asChild variant="outline" className="flex-1">
                <Link to={`/register?redirect=/accept-invitation/${token}`}>
                  {t('auth:register', 'Register')}
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <UserCheck className="h-12 w-12 text-primary mx-auto mb-4" />
          <CardTitle>{t('accept.title')}</CardTitle>
          <CardDescription>
            {t('accept.invitedBy', { name: invitation.inviter.name })}
            <br />
            <span className="font-medium">
              {t('accept.relationshipType', { type: getRelationshipLabel(invitation.relationshipType) })}
            </span>
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-lg bg-muted p-4 text-center">
            <p className="text-lg font-medium">{invitation.inviter.name}</p>
            <p className="text-sm text-muted-foreground">{invitation.inviter.email}</p>
          </div>

          <div className="flex gap-2">
            <Button
              className="flex-1"
              onClick={handleAccept}
              disabled={acceptInvitation.isPending}
            >
              {acceptInvitation.isPending ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <UserCheck className="h-4 w-4 mr-2" />
              )}
              {t('accept.accept')}
            </Button>
            <Button
              variant="outline"
              className="flex-1"
              onClick={handleDecline}
              disabled={acceptInvitation.isPending}
            >
              <UserX className="h-4 w-4 mr-2" />
              {t('accept.decline')}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default AcceptInvitationPage
