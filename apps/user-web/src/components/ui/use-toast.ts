/**
 * @file use-toast.ts
 * @description Toast hook using sonner
 * @task TASK-019
 * @design_state_version 1.6.1
 */

import { toast as sonnerToast } from 'sonner';

interface ToastOptions {
  variant?: 'default' | 'destructive';
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

interface UseToastReturn {
  toast: (options: ToastOptions) => void;
}

export function useToast(): UseToastReturn {
  const toast = (options: ToastOptions): void => {
    const { variant, title, description, action } = options;

    if (variant === 'destructive') {
      sonnerToast.error(title, {
        description,
        action: action
          ? {
              label: action.label,
              onClick: action.onClick,
            }
          : undefined,
      });
    } else {
      sonnerToast(title, {
        description,
        action: action
          ? {
              label: action.label,
              onClick: action.onClick,
            }
          : undefined,
      });
    }
  };

  return { toast };
}
