/**
 * @file NetworkStatusIndicator
 * @description UI component for displaying network connectivity status
 * @task TASK-108
 * @design_state_version 3.13.0
 */
import { useTranslation } from 'react-i18next';
import { useNetworkStatus } from '@/hooks/useNetworkStatus';
import { WifiOff, Wifi } from 'lucide-react';

interface NetworkStatusIndicatorProps {
  showOnlineStatus?: boolean;
  className?: string;
}

export function NetworkStatusIndicator({
  showOnlineStatus = false,
  className = '',
}: NetworkStatusIndicatorProps): JSX.Element | null {
  const { isOnline, wasOffline } = useNetworkStatus();
  const { t } = useTranslation('error');

  if (isOnline && !showOnlineStatus && !wasOffline) {
    return null;
  }

  return (
    <div
      className={`fixed bottom-4 left-4 z-50 flex items-center gap-2 rounded-lg px-4 py-2 shadow-lg transition-all duration-300 ${
        isOnline
          ? wasOffline
            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
            : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200'
          : 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200'
      } ${className}`}
    >
      {isOnline ? (
        <>
          <Wifi className="h-4 w-4" />
          <span className="text-sm font-medium">
            {wasOffline ? t('network.reconnected') : 'Online'}
          </span>
        </>
      ) : (
        <>
          <WifiOff className="h-4 w-4" />
          <span className="text-sm font-medium">{t('network.offline')}</span>
        </>
      )}
    </div>
  );
}

export function OfflineBanner(): JSX.Element | null {
  const { isOnline } = useNetworkStatus();
  const { t } = useTranslation('error');

  if (isOnline) {
    return null;
  }

  return (
    <div className="w-full bg-orange-100 px-4 py-2 text-center text-sm text-orange-800 dark:bg-orange-900 dark:text-orange-200">
      <WifiOff className="mr-2 inline-block h-4 w-4" />
      {t('network.offline')}
    </div>
  );
}
