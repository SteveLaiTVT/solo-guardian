/**
 * @file useNetworkStatus Hook
 * @description Hook for monitoring network connectivity status
 * @task TASK-108
 * @design_state_version 3.13.0
 */
import { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useToast } from '@/components/ui/use-toast';

interface NetworkStatus {
  isOnline: boolean;
  wasOffline: boolean;
}

export function useNetworkStatus(): NetworkStatus {
  const [isOnline, setIsOnline] = useState<boolean>(
    typeof navigator !== 'undefined' ? navigator.onLine : true
  );
  const [wasOffline, setWasOffline] = useState<boolean>(false);
  const { t } = useTranslation('error');
  const { toast } = useToast();

  const handleOnline = useCallback(() => {
    setIsOnline(true);
    if (wasOffline) {
      toast({
        title: t('network.reconnected'),
        description: t('network.offlineHint'),
        variant: 'default',
      });
    }
    setWasOffline(false);
  }, [wasOffline, t, toast]);

  const handleOffline = useCallback(() => {
    setIsOnline(false);
    setWasOffline(true);
    toast({
      title: t('network.offline'),
      description: t('network.offlineHint'),
      variant: 'destructive',
    });
  }, [t, toast]);

  useEffect(() => {
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [handleOnline, handleOffline]);

  return { isOnline, wasOffline };
}
