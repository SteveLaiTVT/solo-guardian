/**
 * @file RegisterPage.tsx
 * @description Registration page with flexible identifiers (email, username, phone)
 * @task TASK-013, TASK-084
 */
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { LanguageSwitcher } from '@/components/ui/LanguageSwitcher'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { useAuthStore } from '@/stores/auth.store'
import { hooks } from '@/lib/api'

interface RegisterFormData {
  name: string
  password: string
  confirmPassword: string
  username?: string
  email?: string
  phone?: string
}

export function RegisterPage(): JSX.Element {
  const { t } = useTranslation('auth')
  const navigate = useNavigate()
  const setTokens = useAuthStore((s) => s.setTokens)
  const [error, setError] = useState<string | null>(null)
  const [showNoIdentifierDialog, setShowNoIdentifierDialog] = useState(false)
  const [pendingData, setPendingData] = useState<RegisterFormData | null>(null)

  const usernameRegex = /^[a-zA-Z][a-zA-Z0-9_-]*$/
  const phoneRegex = /^\+?[0-9]{7,15}$/

  const registerSchema = z
    .object({
      name: z.string().min(1, t('validation.nameRequired')),
      password: z.string().min(8, t('validation.passwordMinLength')),
      confirmPassword: z.string().min(1, t('validation.confirmRequired')),
      username: z
        .string()
        .optional()
        .refine(
          (val) => !val || (val.length >= 3 && val.length <= 30 && usernameRegex.test(val)),
          { message: t('validation.usernameInvalid') }
        ),
      email: z
        .string()
        .optional()
        .refine((val) => !val || z.string().email().safeParse(val).success, {
          message: t('validation.emailInvalid'),
        }),
      phone: z
        .string()
        .optional()
        .refine((val) => !val || phoneRegex.test(val), {
          message: t('validation.phoneInvalid'),
        }),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: t('validation.passwordMismatch'),
      path: ['confirmPassword'],
    })

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  })

  const registerMutation = hooks.useRegister()
  const refreshMutation = hooks.useRefresh()

  const hasAnyIdentifier = (data: RegisterFormData): boolean => {
    const hasUsername = data.username && data.username.trim().length > 0
    const hasEmail = data.email && data.email.trim().length > 0
    const hasPhone = data.phone && data.phone.trim().length > 0
    return !!(hasUsername || hasEmail || hasPhone)
  }

  const doRegister = (data: RegisterFormData): void => {
    setError(null)
    registerMutation.mutate(
      {
        name: data.name,
        password: data.password,
        username: data.username || undefined,
        email: data.email || undefined,
        phone: data.phone || undefined,
      },
      {
        onSuccess: (result) => {
          setTokens(result.tokens.accessToken, result.tokens.refreshToken)
          refreshMutation.mutate(result.tokens.refreshToken)
          navigate('/onboarding')
        },
        onError: (err) => {
          const message = err instanceof Error ? err.message : t('register.failed')
          setError(message)
        },
      }
    )
  }

  const onSubmit = (data: RegisterFormData): void => {
    if (!hasAnyIdentifier(data)) {
      setPendingData(data)
      setShowNoIdentifierDialog(true)
      return
    }
    doRegister(data)
  }

  const handleConfirmNoIdentifier = (): void => {
    setShowNoIdentifierDialog(false)
    if (pendingData) {
      doRegister(pendingData)
      setPendingData(null)
    }
  }

  const handleCancelNoIdentifier = (): void => {
    setShowNoIdentifierDialog(false)
    setPendingData(null)
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <div className="absolute right-4 top-4">
        <LanguageSwitcher />
      </div>
      <Card className="w-full max-w-sm">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-bold">{t('register.title')}</CardTitle>
          <CardDescription>{t('register.subtitle')}</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {error && (
              <div className="rounded-md bg-red-50 p-3 text-sm text-red-500">
                {error}
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="name">{t('fields.name')}</Label>
              <Input
                id="name"
                type="text"
                placeholder={t('fields.namePlaceholder')}
                {...register('name')}
              />
              {errors.name && (
                <p className="text-sm text-red-500">{errors.name.message}</p>
              )}
            </div>

            <div className="rounded-md border p-3 space-y-3">
              <div className="text-sm font-medium text-muted-foreground">
                {t('register.identifiersSection')}
              </div>
              <p className="text-xs text-muted-foreground">
                {t('register.identifiersHintOptional')}
              </p>
              <div className="space-y-2">
                <Label htmlFor="username">{t('fields.username')}</Label>
                <Input
                  id="username"
                  type="text"
                  placeholder={t('fields.usernamePlaceholder')}
                  {...register('username')}
                />
                {errors.username && (
                  <p className="text-sm text-red-500">{errors.username.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">{t('fields.email')}</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder={t('fields.emailPlaceholder')}
                  {...register('email')}
                />
                {errors.email && (
                  <p className="text-sm text-red-500">{errors.email.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">{t('fields.phone')}</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder={t('fields.phonePlaceholder')}
                  {...register('phone')}
                />
                {errors.phone && (
                  <p className="text-sm text-red-500">{errors.phone.message}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">{t('fields.password')}</Label>
              <Input
                id="password"
                type="password"
                placeholder={t('fields.passwordPlaceholder')}
                {...register('password')}
              />
              {errors.password && (
                <p className="text-sm text-red-500">{errors.password.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">{t('fields.confirmPassword')}</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder={t('fields.passwordPlaceholder')}
                {...register('confirmPassword')}
              />
              {errors.confirmPassword && (
                <p className="text-sm text-red-500">{errors.confirmPassword.message}</p>
              )}
            </div>
            <Button
              type="submit"
              className="w-full"
              disabled={registerMutation.isPending}
            >
              {registerMutation.isPending ? t('register.loading') : t('register.button')}
            </Button>
          </form>
          <p className="mt-4 text-center text-sm text-muted-foreground">
            {t('register.hasAccount')}{' '}
            <Link
              to="/login"
              className="underline underline-offset-4 hover:text-primary"
            >
              {t('register.signIn')}
            </Link>
          </p>
        </CardContent>
      </Card>

      <AlertDialog open={showNoIdentifierDialog} onOpenChange={setShowNoIdentifierDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('register.noIdentifierTitle')}</AlertDialogTitle>
            <AlertDialogDescription>
              {t('register.noIdentifierDescription')}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleCancelNoIdentifier}>
              {t('register.noIdentifierCancel')}
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmNoIdentifier}>
              {t('register.noIdentifierConfirm')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
