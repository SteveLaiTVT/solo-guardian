/**
 * @file Error Boundary
 * @description React error boundary for catching unexpected errors
 * @task TASK-019
 * @design_state_version 1.6.1
 */

import { Component, type ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { AlertTriangle } from 'lucide-react';

// DONE(B): Define Props and State interfaces
interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

// DONE(B): Implement ErrorBoundary class component
// - Use static getDerivedStateFromError to set hasError
// - Use componentDidCatch to log errors
// - Render fallback or ErrorFallback when hasError is true
// - Otherwise render children

export class ErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  state: ErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo): void {
    // DONE(B): Log error for debugging
    // Consider sending to error tracking service in production
    console.error('ErrorBoundary caught:', error, info);
  }

  render(): ReactNode {
    if (this.state.hasError) {
      return (
        this.props.fallback ?? (
          <ErrorFallback
            onRetry={() => this.setState({ hasError: false })}
          />
        )
      );
    }
    return this.props.children;
  }
}

// DONE(B): Implement ErrorFallback component
// - Show friendly error message
// - Show retry button
// - Show go back button
// - Use i18n for all text

interface ErrorFallbackProps {
  onRetry: () => void;
}

function ErrorFallback({ onRetry }: ErrorFallbackProps): JSX.Element {
  const { t } = useTranslation('error');

  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] p-8 text-center">
      <AlertTriangle className="w-16 h-16 text-amber-500 mb-4" />
      <h2 className="text-xl font-semibold mb-2">{t('title.systemError')}</h2>
      <p className="text-muted-foreground mb-6">{t('system.unknown')}</p>
      <div className="flex gap-4">
        <Button variant="outline" onClick={() => (window.location.href = '/')}>
          {t('action.goBack')}
        </Button>
        <Button onClick={onRetry}>{t('action.retry')}</Button>
      </div>
    </div>
  );
}

export default ErrorBoundary;
