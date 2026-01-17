/**
 * @file EldersList.tsx
 * @description List of elders a caregiver is caring for
 * @task TASK-046
 * @design_state_version 3.7.0
 */
import { useTranslation } from 'react-i18next';
import { Heart, CheckCircle, Clock, AlertTriangle, Loader2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface Elder {
  id: string;
  name: string;
  email: string;
  lastCheckIn: string | null;
  todayStatus: 'checked_in' | 'pending' | 'overdue';
  isAccepted: boolean;
}

interface EldersListProps {
  elders: Elder[];
  isLoading: boolean;
  onSelectElder?: (elderId: string) => void;
}

export function EldersList({
  elders,
  isLoading,
  onSelectElder,
}: EldersListProps): JSX.Element {
  const { t } = useTranslation('caregiver');

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Heart className="h-5 w-5" />
            {t('elders.title', 'People I Care For')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        </CardContent>
      </Card>
    );
  }

  const getStatusIcon = (status: Elder['todayStatus']): JSX.Element => {
    switch (status) {
      case 'checked_in':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'pending':
        return <Clock className="h-5 w-5 text-yellow-500" />;
      case 'overdue':
        return <AlertTriangle className="h-5 w-5 text-red-500" />;
    }
  };

  const getStatusText = (status: Elder['todayStatus']): string => {
    switch (status) {
      case 'checked_in':
        return t('elders.checkedIn', 'Checked in today');
      case 'pending':
        return t('elders.pending', 'Waiting for check-in');
      case 'overdue':
        return t('elders.overdue', 'Missed check-in!');
    }
  };

  const getStatusBgClass = (status: Elder['todayStatus']): string => {
    switch (status) {
      case 'checked_in':
        return 'bg-green-50 border-green-200';
      case 'pending':
        return 'bg-yellow-50 border-yellow-200';
      case 'overdue':
        return 'bg-red-50 border-red-200';
    }
  };

  const acceptedElders = elders.filter((e) => e.isAccepted);
  const pendingElders = elders.filter((e) => !e.isAccepted);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Heart className="h-5 w-5" />
          {t('elders.title', 'People I Care For')}
        </CardTitle>
        <CardDescription>
          {t('elders.description', 'Monitor their daily check-in status')}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {acceptedElders.length > 0 && (
          <div className="space-y-3">
            {acceptedElders.map((elder) => (
              <div
                key={elder.id}
                className={`flex items-center justify-between rounded-lg border p-4 cursor-pointer hover:shadow-md transition-shadow ${getStatusBgClass(elder.todayStatus)}`}
                onClick={() => onSelectElder?.(elder.id)}
              >
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <Heart className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">{elder.name}</p>
                    <p className="text-sm text-muted-foreground">{elder.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  {getStatusIcon(elder.todayStatus)}
                  <span>{getStatusText(elder.todayStatus)}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {pendingElders.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-muted-foreground">
              {t('elders.pendingAcceptance', 'Waiting for acceptance')}
            </h4>
            {pendingElders.map((elder) => (
              <div
                key={elder.id}
                className="flex items-center justify-between rounded-lg border border-dashed p-3 opacity-60"
              >
                <div>
                  <p className="font-medium">{elder.name}</p>
                  <p className="text-sm text-muted-foreground">{elder.email}</p>
                </div>
                <span className="text-xs text-muted-foreground">
                  {t('elders.invitationSent', 'Invitation sent')}
                </span>
              </div>
            ))}
          </div>
        )}

        {elders.length === 0 && (
          <p className="text-center text-sm text-muted-foreground py-4">
            {t('elders.empty', 'You are not caring for anyone yet. Invite someone to get started.')}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
