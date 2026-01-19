/**
 * @file loading-spinner.tsx
 * @description Loading spinner component for lazy-loaded routes
 * @task TASK-101
 * @design_state_version 3.12.0
 */
import { cn } from '@/lib/utils'

interface LoadingSpinnerProps {
  fullScreen?: boolean
  className?: string
}

export function LoadingSpinner({ fullScreen = false, className }: LoadingSpinnerProps): JSX.Element {
  return (
    <div
      className={cn(
        'flex items-center justify-center',
        fullScreen && 'min-h-screen',
        className
      )}
    >
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
    </div>
  )
}
