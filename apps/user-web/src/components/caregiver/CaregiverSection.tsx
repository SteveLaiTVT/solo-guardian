/**
 * @file CaregiverSection.tsx
 * @description Section showing caregivers who can view this user's status
 * @task TASK-046
 * @design_state_version 3.7.0
 */
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Users, UserCheck, UserX, Loader2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface Caregiver {
  id: string;
  name: string;
  email: string;
  isAccepted: boolean;
}

interface CaregiverSectionProps {
  caregivers: Caregiver[];
  isLoading: boolean;
  onAccept?: (caregiverId: string) => void;
  onRemove?: (caregiverId: string) => void;
}

export function CaregiverSection({
  caregivers,
  isLoading,
  onAccept,
  onRemove,
}: CaregiverSectionProps): JSX.Element {
  const { t } = useTranslation('caregiver');
  const [processingId, setProcessingId] = useState<string | null>(null);

  const handleAccept = async (caregiverId: string): Promise<void> => {
    setProcessingId(caregiverId);
    try {
      await onAccept?.(caregiverId);
    } finally {
      setProcessingId(null);
    }
  };

  const handleRemove = async (caregiverId: string): Promise<void> => {
    setProcessingId(caregiverId);
    try {
      await onRemove?.(caregiverId);
    } finally {
      setProcessingId(null);
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            {t('caregivers.title', 'My Caregivers')}
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

  const pendingCaregivers = caregivers.filter((c) => !c.isAccepted);
  const acceptedCaregivers = caregivers.filter((c) => c.isAccepted);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          {t('caregivers.title', 'My Caregivers')}
        </CardTitle>
        <CardDescription>
          {t('caregivers.description', 'People who can view your check-in status')}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {pendingCaregivers.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-muted-foreground">
              {t('caregivers.pending', 'Pending Requests')}
            </h4>
            {pendingCaregivers.map((caregiver) => (
              <div
                key={caregiver.id}
                className="flex items-center justify-between rounded-lg border border-yellow-200 bg-yellow-50 p-3"
              >
                <div>
                  <p className="font-medium">{caregiver.name}</p>
                  <p className="text-sm text-muted-foreground">{caregiver.email}</p>
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    onClick={() => handleAccept(caregiver.id)}
                    disabled={processingId === caregiver.id}
                  >
                    {processingId === caregiver.id ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <UserCheck className="h-4 w-4 mr-1" />
                    )}
                    {t('caregivers.accept', 'Accept')}
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleRemove(caregiver.id)}
                    disabled={processingId === caregiver.id}
                  >
                    <UserX className="h-4 w-4 mr-1" />
                    {t('caregivers.decline', 'Decline')}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}

        {acceptedCaregivers.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-muted-foreground">
              {t('caregivers.active', 'Active Caregivers')}
            </h4>
            {acceptedCaregivers.map((caregiver) => (
              <div
                key={caregiver.id}
                className="flex items-center justify-between rounded-lg border p-3"
              >
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <Users className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">{caregiver.name}</p>
                    <p className="text-sm text-muted-foreground">{caregiver.email}</p>
                  </div>
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  onClick={() => handleRemove(caregiver.id)}
                  disabled={processingId === caregiver.id}
                >
                  {processingId === caregiver.id ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    t('caregivers.remove', 'Remove')
                  )}
                </Button>
              </div>
            ))}
          </div>
        )}

        {caregivers.length === 0 && (
          <p className="text-center text-sm text-muted-foreground py-4">
            {t('caregivers.empty', 'No caregivers yet. They can invite you to care for you.')}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
