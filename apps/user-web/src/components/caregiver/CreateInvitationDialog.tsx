/**
 * @file CreateInvitationDialog.tsx
 * @description Dialog for creating QR/link invitations for caregivers/family/caretakers
 * @task TASK-062
 * @design_state_version 3.8.0
 */
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { QrCode, Link2, Copy, Check, Loader2, UserPlus } from 'lucide-react';
import QRCode from 'react-qr-code';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { hooks } from '@/lib/api';
import type { RelationshipType, InvitationResponse } from '@solo-guardian/api-client';

interface CreateInvitationDialogProps {
  onSuccess?: () => void;
}

export function CreateInvitationDialog({ onSuccess }: CreateInvitationDialogProps): JSX.Element {
  const { t } = useTranslation('caregiver');
  const createInvitation = hooks.useCreateInvitation();

  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<'form' | 'result'>('form');
  const [relationshipType, setRelationshipType] = useState<RelationshipType>('caregiver');
  const [targetEmail, setTargetEmail] = useState('');
  const [targetPhone, setTargetPhone] = useState('');
  const [invitation, setInvitation] = useState<InvitationResponse | null>(null);
  const [copied, setCopied] = useState(false);

  const handleCreate = async (): Promise<void> => {
    try {
      const result = await createInvitation.mutateAsync({
        relationshipType,
        targetEmail: targetEmail || undefined,
        targetPhone: targetPhone || undefined,
      });
      setInvitation(result);
      setStep('result');
      toast.success(t('invitation.success'));
      onSuccess?.();
    } catch {
      toast.error(t('common:error'));
    }
  };

  const handleCopyLink = async (): Promise<void> => {
    if (!invitation) return;
    const link = `${window.location.origin}/accept-invitation/${invitation.token}`;
    await navigator.clipboard.writeText(link);
    setCopied(true);
    toast.success(t('invitation.linkCopied'));
    setTimeout(() => setCopied(false), 2000);
  };

  const handleClose = (isOpen: boolean): void => {
    setOpen(isOpen);
    if (!isOpen) {
      setStep('form');
      setRelationshipType('caregiver');
      setTargetEmail('');
      setTargetPhone('');
      setInvitation(null);
      setCopied(false);
    }
  };

  const inviteLink = invitation
    ? `${window.location.origin}/accept-invitation/${invitation.token}`
    : '';

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogTrigger asChild>
        <Button>
          <UserPlus className="h-4 w-4 mr-2" />
          {t('invitation.create')}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{t('invitation.createTitle')}</DialogTitle>
          <DialogDescription>
            {step === 'form'
              ? t('invitation.createDescription', 'Create an invitation link or QR code to share')
              : t('invitation.shareDescription', 'Share this link or QR code')}
          </DialogDescription>
        </DialogHeader>

        {step === 'form' && (
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>{t('invitation.relationshipType')}</Label>
              <Select
                value={relationshipType}
                onValueChange={(v) => setRelationshipType(v as RelationshipType)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="caregiver">
                    <div className="flex flex-col">
                      <span>{t('invitation.types.caregiver')}</span>
                      <span className="text-xs text-muted-foreground">
                        {t('invitation.typeDescriptions.caregiver')}
                      </span>
                    </div>
                  </SelectItem>
                  <SelectItem value="family">
                    <div className="flex flex-col">
                      <span>{t('invitation.types.family')}</span>
                      <span className="text-xs text-muted-foreground">
                        {t('invitation.typeDescriptions.family')}
                      </span>
                    </div>
                  </SelectItem>
                  <SelectItem value="caretaker">
                    <div className="flex flex-col">
                      <span>{t('invitation.types.caretaker')}</span>
                      <span className="text-xs text-muted-foreground">
                        {t('invitation.typeDescriptions.caretaker')}
                      </span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="targetEmail">{t('invitation.targetEmail')}</Label>
              <Input
                id="targetEmail"
                type="email"
                placeholder="caregiver@example.com"
                value={targetEmail}
                onChange={(e) => setTargetEmail(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="targetPhone">{t('invitation.targetPhone')}</Label>
              <Input
                id="targetPhone"
                type="tel"
                placeholder="+1234567890"
                value={targetPhone}
                onChange={(e) => setTargetPhone(e.target.value)}
              />
            </div>

            <Button
              className="w-full"
              onClick={handleCreate}
              disabled={createInvitation.isPending}
            >
              {createInvitation.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  {t('common:loading')}
                </>
              ) : (
                <>
                  <QrCode className="h-4 w-4 mr-2" />
                  {t('invitation.create')}
                </>
              )}
            </Button>
          </div>
        )}

        {step === 'result' && invitation && (
          <div className="space-y-4 py-4">
            <div className="flex justify-center p-4 bg-white rounded-lg">
              <QRCode value={inviteLink} size={200} />
            </div>

            <div className="space-y-2">
              <Label>{t('invitation.shareLink')}</Label>
              <div className="flex gap-2">
                <Input
                  value={inviteLink}
                  readOnly
                  className="font-mono text-sm"
                />
                <Button variant="outline" size="icon" onClick={handleCopyLink}>
                  {copied ? (
                    <Check className="h-4 w-4 text-green-500" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>

            <div className="text-center text-sm text-muted-foreground">
              <Link2 className="h-4 w-4 inline mr-1" />
              {t('invitation.expiresAt')}: {new Date(invitation.expiresAt).toLocaleString()}
            </div>

            <Button variant="outline" className="w-full" onClick={() => handleClose(false)}>
              {t('common:done', 'Done')}
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
