/**
 * @file CaregiverPage.tsx
 * @description Caregiver dashboard with elders list, check-in on behalf, and notes
 * @task TASK-063
 * @design_state_version 3.8.0
 */
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CreateInvitationDialog } from '@/components/caregiver/CreateInvitationDialog';
import { EldersList } from '@/components/caregiver/EldersList';
import { CaregiverSection } from '@/components/caregiver/CaregiverSection';
import { ElderDetailSheet } from './ElderDetailSheet';
import { hooks } from '@/lib/api';

function CaregiverPage(): JSX.Element {
  const { t } = useTranslation('caregiver');
  const [selectedElderId, setSelectedElderId] = useState<string | null>(null);

  const { data: elders = [], isLoading: eldersLoading, refetch: refetchElders } = hooks.useElders();
  const { data: caregivers = [], isLoading: caregiversLoading } = hooks.useCaregivers();

  const handleSelectElder = (elderId: string): void => {
    setSelectedElderId(elderId);
  };

  const handleCloseDetail = (): void => {
    setSelectedElderId(null);
  };

  const handleCheckInSuccess = (): void => {
    refetchElders();
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">{t('title')}</h1>
        <CreateInvitationDialog onSuccess={() => refetchElders()} />
      </div>

      <Tabs defaultValue="elders" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="elders">{t('tabs.elders')}</TabsTrigger>
          <TabsTrigger value="caregivers">{t('tabs.caregivers')}</TabsTrigger>
        </TabsList>

        <TabsContent value="elders" className="mt-4">
          <EldersList
            elders={elders}
            isLoading={eldersLoading}
            onSelectElder={handleSelectElder}
          />
        </TabsContent>

        <TabsContent value="caregivers" className="mt-4">
          <CaregiverSection
            caregivers={caregivers}
            isLoading={caregiversLoading}
          />
        </TabsContent>
      </Tabs>

      <ElderDetailSheet
        elderId={selectedElderId}
        open={!!selectedElderId}
        onClose={handleCloseDetail}
        onCheckInSuccess={handleCheckInSuccess}
      />
    </div>
  );
}

export default CaregiverPage
