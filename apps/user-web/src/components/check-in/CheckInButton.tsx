/**
 * @file CheckInButton.tsx
 * @description Large circular check-in button component
 * @task TASK-013
 * @design_state_version 1.2.2
 */
import { useTranslation } from 'react-i18next'
import { Check, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

interface CheckInButtonProps {
  status: 'pending' | 'overdue' | 'completed'
  onCheckIn: () => void
  isLoading: boolean
}

// DONE(B): Added i18n support - TASK-013
export function CheckInButton({ status, onCheckIn, isLoading }: CheckInButtonProps): JSX.Element {
  const { t } = useTranslation('dashboard')
  const isDisabled = status === 'completed' || isLoading

  return (
    <button
      onClick={onCheckIn}
      disabled={isDisabled}
      className={cn(
        'flex h-40 w-40 items-center justify-center rounded-full text-white transition-all md:h-48 md:w-48',
        'focus:outline-none focus:ring-4 focus:ring-offset-2',
        {
          'bg-green-500 hover:bg-green-600 focus:ring-green-300': status === 'pending',
          'bg-red-500 hover:bg-red-600 animate-pulse focus:ring-red-300': status === 'overdue',
          'bg-gray-300 cursor-default': status === 'completed',
        }
      )}
    >
      {isLoading ? (
        <Loader2 className="h-12 w-12 animate-spin" />
      ) : status === 'completed' ? (
        <Check className="h-16 w-16" />
      ) : (
        <span className="text-xl font-semibold md:text-2xl">
          {status === 'overdue' ? t('button.checkInNow') : t('button.checkIn')}
        </span>
      )}
    </button>
  )
}
