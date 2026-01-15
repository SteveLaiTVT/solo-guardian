/**
 * @file FeatureToggle.tsx
 * @description Reusable feature toggle component
 * @task TASK-022
 * @design_state_version 1.6.0
 */
import type { ReactNode } from 'react';
import { Card, CardContent } from '@/components/ui/card';

interface FeatureToggleProps {
  icon: ReactNode;
  title: string;
  description: string;
  enabled: boolean;
  onChange: (enabled: boolean) => void;
  disabled?: boolean;
}

export function FeatureToggle({
  icon,
  title,
  description,
  enabled,
  onChange,
  disabled = false,
}: FeatureToggleProps): JSX.Element {
  return (
    <Card
      className={`cursor-pointer transition-all ${
        enabled ? 'border-primary' : ''
      } ${disabled ? 'opacity-50' : ''}`}
      onClick={() => !disabled && onChange(!enabled)}
    >
      <CardContent className="flex items-center space-x-4 p-4">
        <div
          className={`flex h-10 w-10 items-center justify-center rounded-full ${
            enabled ? 'bg-primary/10' : 'bg-muted'
          }`}
        >
          {icon}
        </div>
        <div className="flex-1">
          <h3 className="font-medium">{title}</h3>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
        <div
          className={`h-5 w-9 rounded-full transition-colors ${
            enabled ? 'bg-primary' : 'bg-muted'
          }`}
        >
          <div
            className={`h-5 w-5 rounded-full bg-white shadow-sm transition-transform ${
              enabled ? 'translate-x-4' : ''
            }`}
          />
        </div>
      </CardContent>
    </Card>
  );
}
