/**
 * @file useErrorHandler Hook
 * @description Error handling hook with toast notifications and i18n
 * @task TASK-019
 * @design_state_version 1.6.1
 */

import { useTranslation } from 'react-i18next';
import { useToast } from '@/components/ui/use-toast';
import { parseApiError, type ParsedError } from '@solo-guardian/api-client';

// DONE(B): Define hook options interface
interface HandleErrorOptions {
  silent?: boolean;
}

// DONE(B): Implement useErrorHandler hook
// - Use useTranslation('error') for error messages
// - Use useToast for showing notifications
// - Return handleError function and parseApiError

export function useErrorHandler(): {
  handleError: (error: unknown, options?: HandleErrorOptions) => ParsedError;
  parseApiError: typeof parseApiError;
} {
  const { t } = useTranslation('error');
  const { toast } = useToast();

  // DONE(B): Implement handleError function
  // - Parse the error using parseApiError
  // - If silent option is true, just return parsed error
  // - Get translated title based on isUserError
  // - Get translated description using i18nKey with details
  // - Show toast with appropriate variant
  // - For network errors, add retry action

  const handleError = (
    error: unknown,
    options?: HandleErrorOptions,
  ): ParsedError => {
    const parsed = parseApiError(error);

    if (options?.silent) {
      return parsed;
    }

    // Get translated message
    const title = parsed.isUserError
      ? t('title.userError') // "Please check your input"
      : t('title.systemError'); // "Something went wrong"

    const description = t(parsed.i18nKey, {
      defaultValue: parsed.message,
      ...parsed.details,
    });

    // DONE(B): Show toast with appropriate variant
    // - User errors: 'default' variant
    // - System errors: 'destructive' variant
    // - Network errors: add retry action

    toast({
      variant: parsed.isUserError ? 'default' : 'destructive',
      title,
      description,
      // Add action for network errors
      ...(parsed.isNetworkError && {
        action: {
          label: t('action.retry'),
          onClick: () => window.location.reload(),
        },
      }),
    });

    return parsed;
  };

  return { handleError, parseApiError };
}
