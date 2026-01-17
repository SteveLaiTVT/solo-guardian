/**
 * @file ElderDetailSheet.tsx
 * @description Sheet showing elder details with check-in on behalf and notes
 * @task TASK-063
 * @design_state_version 3.8.0
 */
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  CheckCircle,
  Clock,
  AlertTriangle,
  Loader2,
  Send,
  StickyNote,
  Shield,
  Users,
} from 'lucide-react';
import { toast } from 'sonner';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { hooks } from '@/lib/api';

interface ElderDetailSheetProps {
  elderId: string | null;
  open: boolean;
  onClose: () => void;
  onCheckInSuccess?: () => void;
}

export function ElderDetailSheet({
  elderId,
  open,
  onClose,
  onCheckInSuccess,
}: ElderDetailSheetProps): JSX.Element {
  const { t } = useTranslation('caregiver');

  const { data: elder, isLoading: elderLoading } = hooks.useElderDetail(elderId || '');
  const { data: notes = [], isLoading: notesLoading, refetch: refetchNotes } = hooks.useElderNotes(elderId || '');
  const checkInOnBehalf = hooks.useCheckInOnBehalf();
  const addNote = hooks.useAddNote();

  const [checkInNote, setCheckInNote] = useState('');
  const [newNote, setNewNote] = useState('');

  const handleCheckIn = async (): Promise<void> => {
    if (!elderId) return;
    try {
      await checkInOnBehalf.mutateAsync({
        elderId,
        data: checkInNote ? { note: checkInNote } : undefined,
      });
      toast.success(t('checkIn.success', { name: elder?.name }));
      setCheckInNote('');
      onCheckInSuccess?.();
    } catch {
      toast.error(t('checkIn.error'));
    }
  };

  const handleAddNote = async (): Promise<void> => {
    if (!elderId || !newNote.trim()) return;
    try {
      await addNote.mutateAsync({
        elderId,
        data: { content: newNote },
      });
      toast.success(t('notes.success'));
      setNewNote('');
      refetchNotes();
    } catch {
      toast.error(t('common:error'));
    }
  };

  const getStatusBadge = (status: string): JSX.Element => {
    switch (status) {
      case 'checked_in':
        return (
          <Badge className="bg-green-500">
            <CheckCircle className="h-3 w-3 mr-1" />
            {t('elders.status.checked_in')}
          </Badge>
        );
      case 'pending':
        return (
          <Badge className="bg-yellow-500">
            <Clock className="h-3 w-3 mr-1" />
            {t('elders.status.pending')}
          </Badge>
        );
      case 'overdue':
        return (
          <Badge className="bg-red-500">
            <AlertTriangle className="h-3 w-3 mr-1" />
            {t('elders.status.overdue')}
          </Badge>
        );
      default:
        return <Badge>{status}</Badge>;
    }
  };

  return (
    <Sheet open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
        {elderLoading ? (
          <div className="flex items-center justify-center h-full">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : elder ? (
          <>
            <SheetHeader>
              <SheetTitle className="flex items-center gap-2">
                {elder.name}
                {getStatusBadge(elder.todayStatus)}
              </SheetTitle>
              <SheetDescription>{elder.email}</SheetDescription>
            </SheetHeader>

            <div className="mt-6 space-y-6">
              {elder.checkInSettings && (
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      {t('detail.settings')}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">{t('detail.deadline')}</span>
                      <span>{elder.checkInSettings.deadlineTime}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">{t('detail.reminder')}</span>
                      <span>{elder.checkInSettings.reminderTime}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">{t('detail.timezone')}</span>
                      <span>{elder.checkInSettings.timezone}</span>
                    </div>
                  </CardContent>
                </Card>
              )}

              {elder.pendingAlerts > 0 && (
                <Card className="border-red-200 bg-red-50">
                  <CardContent className="pt-4">
                    <div className="flex items-center gap-2 text-red-600">
                      <AlertTriangle className="h-5 w-5" />
                      <span className="font-medium">
                        {t('detail.alerts')}: {elder.pendingAlerts}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              )}

              {elder.emergencyContacts && elder.emergencyContacts.length > 0 && (
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      {t('detail.contacts')}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {elder.emergencyContacts.map((contact) => (
                      <div
                        key={contact.id}
                        className="flex items-center justify-between text-sm"
                      >
                        <span>{contact.name}</span>
                        <Badge variant={contact.isVerified ? 'default' : 'secondary'}>
                          <Shield className="h-3 w-3 mr-1" />
                          {contact.isVerified ? t('detail.verified') : t('detail.unverified')}
                        </Badge>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              )}

              <Separator />

              <div className="space-y-3">
                <Label className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4" />
                  {t('checkIn.onBehalf')}
                </Label>
                <Textarea
                  placeholder={t('checkIn.notePlaceholder', { name: elder.name })}
                  value={checkInNote}
                  onChange={(e) => setCheckInNote(e.target.value)}
                  rows={2}
                />
                <Button
                  onClick={handleCheckIn}
                  disabled={checkInOnBehalf.isPending || elder.todayStatus === 'checked_in'}
                  className="w-full"
                >
                  {checkInOnBehalf.isPending ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <CheckCircle className="h-4 w-4 mr-2" />
                  )}
                  {elder.todayStatus === 'checked_in'
                    ? t('elders.status.checked_in')
                    : t('checkIn.onBehalf')}
                </Button>
              </div>

              <Separator />

              <div className="space-y-3">
                <Label className="flex items-center gap-2">
                  <StickyNote className="h-4 w-4" />
                  {t('notes.add')}
                </Label>
                <Textarea
                  placeholder={t('notes.placeholder')}
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  rows={3}
                />
                <Button
                  onClick={handleAddNote}
                  disabled={addNote.isPending || !newNote.trim()}
                  variant="outline"
                  className="w-full"
                >
                  {addNote.isPending ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Send className="h-4 w-4 mr-2" />
                  )}
                  {t('notes.save')}
                </Button>
              </div>

              {(notes.length > 0 || notesLoading) && (
                <>
                  <Separator />
                  <div className="space-y-3">
                    <Label className="flex items-center gap-2">
                      <StickyNote className="h-4 w-4" />
                      {t('notes.title')}
                    </Label>
                    {notesLoading ? (
                      <div className="flex justify-center py-4">
                        <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                      </div>
                    ) : notes.length > 0 ? (
                      <div className="space-y-2 max-h-60 overflow-y-auto">
                        {notes.map((note) => (
                          <div
                            key={note.id}
                            className="rounded-lg border p-3 text-sm space-y-1"
                          >
                            <p className="whitespace-pre-wrap">{note.content}</p>
                            <p className="text-xs text-muted-foreground">
                              {new Date(note.createdAt).toLocaleString()}
                            </p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground text-center py-4">
                        {t('notes.empty')}
                      </p>
                    )}
                  </div>
                </>
              )}
            </div>
          </>
        ) : (
          <div className="flex items-center justify-center h-full">
            <p className="text-muted-foreground">{t('common:notFound', 'Not found')}</p>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
