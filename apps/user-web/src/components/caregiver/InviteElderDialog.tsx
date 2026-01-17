/**
 * @file InviteElderDialog.tsx
 * @description Dialog for inviting an elder to care for
 * @task TASK-046
 * @design_state_version 3.7.0
 */
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { UserPlus, Loader2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface InviteElderDialogProps {
  onInvite: (email: string, message?: string) => Promise<void>;
}

export function InviteElderDialog({ onInvite }: InviteElderDialogProps): JSX.Element {
  const { t } = useTranslation('caregiver');
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      await onInvite(email, message || undefined);
      setOpen(false);
      setEmail('');
      setMessage('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send invitation');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <UserPlus className="h-4 w-4 mr-2" />
          {t('invite.button', 'Invite to Care For')}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>{t('invite.title', 'Invite Someone to Care For')}</DialogTitle>
            <DialogDescription>
              {t('invite.description', 'Enter the email of the person you want to care for. They will receive an invitation to accept.')}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="email">{t('invite.email', 'Email Address')}</Label>
              <Input
                id="email"
                type="email"
                placeholder="elder@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="message">{t('invite.message', 'Personal Message (optional)')}</Label>
              <Input
                id="message"
                placeholder={t('invite.messagePlaceholder', 'I would like to help watch over you...')}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
            </div>
            {error && (
              <p className="text-sm text-red-500">{error}</p>
            )}
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              {t('common:cancel', 'Cancel')}
            </Button>
            <Button type="submit" disabled={isLoading || !email}>
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  {t('invite.sending', 'Sending...')}
                </>
              ) : (
                t('invite.send', 'Send Invitation')
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
