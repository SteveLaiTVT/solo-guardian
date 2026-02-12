# Frontend Development Skill

This skill provides expertise in React frontend development for Solo Guardian.

## When to Use This Skill

Use this skill when working on:
- React components and pages
- State management (Zustand, TanStack Query)
- API integration via `@solo-guardian/api-client`
- UI components (shadcn/ui, Ant Design)
- Internationalization (i18n)
- Frontend routing and navigation
- Frontend forms and validation

## Technology Stack

### User Web (`apps/user-web`)
- React 18 + Vite
- Tailwind CSS + shadcn/ui
- Zustand (auth state)
- TanStack Query (server state)
- react-i18next (i18n)

### Admin Web (`apps/admin-web`)
- React 18 + Vite
- Ant Design
- Zustand (auth state)
- TanStack Query (server state)
- react-i18next (i18n)

## Architecture Pattern

```
Component → Custom Hook → API Client → Backend
    ↓            ↓              ↓
  View      Business        Network
           Logic
```

## Key Principles

1. **Functional Components Only**
   - Use function components with hooks
   - No class components

2. **Business Logic in Hooks**
   - Extract logic into custom hooks
   - Keep components focused on rendering

3. **API Calls via api-client**
   - Use `@solo-guardian/api-client` hooks
   - Never use axios/fetch directly in components

4. **State Management**
   - Zustand for global/auth state
   - TanStack Query for server state
   - Local state with useState for UI-only state

## Component Template

```typescript
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useCheckIn } from '@solo-guardian/api-client';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';

interface CheckInButtonProps {
  userId: string;
  onSuccess?: () => void;
}

export function CheckInButton({ userId, onSuccess }: CheckInButtonProps): JSX.Element {
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);
  const { mutate: checkIn } = useCheckIn();

  const handleCheckIn = (): void => {
    setIsLoading(true);
    checkIn(
      { userId },
      {
        onSuccess: () => {
          toast({
            title: t('checkIn.success'),
            variant: 'success',
          });
          onSuccess?.();
        },
        onError: (error) => {
          toast({
            title: t('checkIn.error'),
            description: error.message,
            variant: 'destructive',
          });
        },
        onSettled: () => {
          setIsLoading(false);
        },
      },
    );
  };

  return (
    <Button onClick={handleCheckIn} disabled={isLoading}>
      {isLoading ? t('common.loading') : t('checkIn.button')}
    </Button>
  );
}
```

## Custom Hook Template

```typescript
import { useState, useEffect } from 'react';
import { useAuth } from '@/stores/auth';
import { useGetCheckInHistory } from '@solo-guardian/api-client';

interface UseCheckInHistoryReturn {
  history: CheckInHistory[];
  isLoading: boolean;
  error: Error | null;
  refetch: () => void;
}

export function useCheckInHistory(): UseCheckInHistoryReturn {
  const { user } = useAuth();
  const [history, setHistory] = useState<CheckInHistory[]>([]);

  const {
    data,
    isLoading,
    error,
    refetch,
  } = useGetCheckInHistory(user?.id || '');

  useEffect(() => {
    if (data?.success) {
      setHistory(data.data);
    }
  }, [data]);

  return {
    history,
    isLoading,
    error: error as Error | null,
    refetch,
  };
}
```

## Page Template

```typescript
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { PageHeader } from '@/components/layout/PageHeader';
import { CheckInHistory } from '@/components/check-in/CheckInHistory';
import { useCheckInHistory } from '@/hooks/useCheckInHistory';

export function DashboardPage(): JSX.Element {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { history, isLoading, error, refetch } = useCheckInHistory();

  if (isLoading) {
    return <div>{t('common.loading')}</div>;
  }

  if (error) {
    return <div>{t('common.error')}: {error.message}</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <PageHeader
        title={t('dashboard.title')}
        subtitle={t('dashboard.subtitle')}
      />
      <CheckInHistory history={history} onRefresh={refetch} />
    </div>
  );
}
```

## API Client Usage

```typescript
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@solo-guardian/api-client';

// Query example
export function useGetContacts(userId: string) {
  return useQuery({
    queryKey: ['contacts', userId],
    queryFn: () => apiClient.getContacts(userId),
    enabled: !!userId,
  });
}

// Mutation example
export function useCreateContact() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateContactDto) => apiClient.createContact(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contacts'] });
    },
  });
}
```

## Zustand Store Template

```typescript
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  setUser: (user: User | null) => void;
  setTokens: (accessToken: string, refreshToken: string) => void;
  logout: () => void;
}

export const useAuth = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      setUser: (user) => set({ user }),
      setTokens: (accessToken, refreshToken) => set({ accessToken, refreshToken }),
      logout: () => set({ user: null, accessToken: null, refreshToken: null }),
    }),
    {
      name: 'auth-storage',
    },
  ),
);
```

## Form Handling

```typescript
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const formSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100),
  email: z.string().email('Invalid email'),
});

type FormValues = z.infer<typeof formSchema>;

export function ContactForm({ onSubmit }: { onSubmit: (data: FormValues) => void }): JSX.Element {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: '',
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input {...field} type="email" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
}
```

## Internationalization (i18n)

```typescript
// src/i18n/en.json
{
  "auth": {
    "login": "Log In",
    "logout": "Log Out",
    "email": "Email",
    "password": "Password"
  },
  "checkIn": {
    "button": "Check In",
    "success": "Check-in successful!",
    "error": "Check-in failed"
  }
}

// Usage in component
import { useTranslation } from 'react-i18next';

export function LoginPage(): JSX.Element {
  const { t, i18n } = useTranslation();

  const changeLanguage = (lang: string): void => {
    i18n.changeLanguage(lang);
  };

  return (
    <div>
      <h1>{t('auth.login')}</h1>
      <button onClick={() => changeLanguage('zh')}>中文</button>
      <button onClick={() => changeLanguage('en')}>English</button>
    </div>
  );
}
```

## Common Commands

```bash
# User Web
cd apps/user-web
pnpm run dev                    # Dev server :5173
pnpm run build                  # Production build
pnpm run preview                # Preview build
pnpm run lint                   # ESLint

# Admin Web
cd apps/admin-web
pnpm run dev                    # Dev server :5174
pnpm run build                  # Production build
pnpm run preview                # Preview build
pnpm run lint                   # ESLint
```

## Code Style

- No `any` type
- Every function has return type
- Functional components only
- Single function < 50 lines
- Single file < 300 lines
- Use TypeScript interfaces for props
- Extract business logic to custom hooks
- Use Tailwind CSS classes (user-web)
- Use Ant Design components (admin-web)

## Component Organization

```
src/
├── components/
│   ├── ui/              # shadcn/ui components
│   ├── layout/          # Layout components
│   ├── auth/            # Auth-related components
│   ├── check-in/        # Check-in components
│   └── contacts/        # Contact components
├── pages/
│   ├── auth/
│   ├── dashboard/
│   └── contacts/
├── hooks/               # Custom hooks
├── stores/              # Zustand stores
├── i18n/                # Translation files
├── lib/                 # Utilities
└── types/               # TypeScript types
```

## Performance Optimization

1. **Code Splitting**
   ```typescript
   import { lazy, Suspense } from 'react';

   const Dashboard = lazy(() => import('./pages/Dashboard'));

   <Suspense fallback={<Loading />}>
     <Dashboard />
   </Suspense>
   ```

2. **Memoization**
   ```typescript
   import { useMemo, useCallback } from 'react';

   const memoizedValue = useMemo(() => computeExpensiveValue(a, b), [a, b]);
   const memoizedCallback = useCallback(() => doSomething(a, b), [a, b]);
   ```

3. **Virtual Lists**
   - Use `react-window` or `react-virtualized` for long lists

## Accessibility

- Use semantic HTML
- Add ARIA labels where needed
- Ensure keyboard navigation works
- Test with screen readers
- Maintain color contrast ratios

## Testing (Future)

```typescript
import { render, screen, fireEvent } from '@testing-library/react';
import { CheckInButton } from './CheckInButton';

describe('CheckInButton', () => {
  it('renders button with correct text', () => {
    render(<CheckInButton userId="123" />);
    expect(screen.getByRole('button')).toHaveTextContent('Check In');
  });

  it('calls onSuccess when check-in succeeds', async () => {
    const onSuccess = jest.fn();
    render(<CheckInButton userId="123" onSuccess={onSuccess} />);
    
    fireEvent.click(screen.getByRole('button'));
    // Add assertions
  });
});
```

## Related Files

- `apps/user-web/src/` - User web source
- `apps/admin-web/src/` - Admin web source
- `packages/api-client/` - API client package
- `packages/types/` - Shared types
- `AGENTS.md` - Full architecture guide
