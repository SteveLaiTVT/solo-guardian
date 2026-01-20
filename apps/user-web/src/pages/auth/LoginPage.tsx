/**
 * @file LoginPage.tsx
 * @description Login page with flexible identifier authentication
 * @task TASK-013, TASK-041, TASK-085
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
import { useAuthStore } from '@/stores/auth.store'
import { hooks } from '@/lib/api'
import { OAuthButtons } from '@/components/auth'
import { useErrorHandler } from '@/hooks/useErrorHandler'

function LoginPage(): JSX.Element {
  const { t } = useTranslation('auth')
  const { t: tError } = useTranslation('error')
  const navigate = useNavigate()
  const setTokens = useAuthStore((s) => s.setTokens)
  const [error, setError] = useState<string | null>(null)
  const { parseApiError } = useErrorHandler()

  const loginSchema = z.object({
    identifier: z.string().min(1, t('validation.identifierRequired')),
    password: z.string().min(1, t('validation.passwordRequired')),
  })

  type LoginFormData = z.infer<typeof loginSchema>

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  })

  const loginMutation = hooks.useLogin()
  const refreshMutation = hooks.useRefresh()

  const onSubmit = (data: LoginFormData): void => {
    setError(null)
    loginMutation.mutate(data, {
      onSuccess: (result) => {
        setTokens(result.tokens.accessToken, result.tokens.refreshToken)
        refreshMutation.mutate(result.tokens.refreshToken)
        navigate('/')
      },
      onError: (err) => {
        const parsed = parseApiError(err)
        // Strip 'error.' prefix since we're using 'error' namespace
        const key = parsed.i18nKey.replace(/^error\./, '')
        const message = tError(key, { defaultValue: t('login.failed') })
        setError(message)
      },
    })
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <div className="absolute right-4 top-4">
        <LanguageSwitcher />
      </div>
      <Card className="w-full max-w-sm">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-bold">{t('login.title')}</CardTitle>
          <CardDescription>{t('login.subtitle')}</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {error && (
              <div className="rounded-md bg-red-50 p-3 text-sm text-red-500">
                {error}
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="identifier">{t('fields.identifier')}</Label>
              <Input
                id="identifier"
                type="text"
                placeholder={t('fields.identifierPlaceholder')}
                {...register('identifier')}
              />
              {errors.identifier && (
                <p className="text-sm text-red-500">{errors.identifier.message}</p>
              )}
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
            <Button
              type="submit"
              className="w-full"
              disabled={loginMutation.isPending}
            >
              {loginMutation.isPending ? t('login.loading') : t('login.button')}
            </Button>
          </form>

          {/* OAuth Login Buttons */}
          <div className="mt-6">
            <OAuthButtons mode="login" />
          </div>

          <p className="mt-4 text-center text-sm text-muted-foreground">
            {t('login.noAccount')}{' '}
            <Link
              to="/register"
              className="underline underline-offset-4 hover:text-primary"
            >
              {t('login.signUp')}
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  )
}

export default LoginPage
