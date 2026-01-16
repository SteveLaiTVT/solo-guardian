/**
 * @file OAuthCallback.tsx
 * @description OAuth callback handler page
 * @task TASK-041
 * @design_state_version 3.6.0
 */
import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useAuthStore } from '@/stores/auth.store'

export function OAuthCallback(): JSX.Element {
  const { t } = useTranslation('auth')
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const setTokens = useAuthStore((s) => s.setTokens)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const accessToken = searchParams.get('access_token')
    const refreshToken = searchParams.get('refresh_token')
    const errorParam = searchParams.get('error')
    const errorDescription = searchParams.get('error_description')
    const isNewUser = searchParams.get('is_new_user') === 'true'

    if (errorParam) {
      setError(errorDescription || errorParam || t('oauth.error'))
      return
    }

    if (accessToken && refreshToken) {
      // Store tokens
      setTokens(accessToken, refreshToken)

      // Clear OAuth return URL from session storage
      sessionStorage.removeItem('oauth_return_url')

      // Redirect based on whether this is a new user
      if (isNewUser) {
        navigate('/onboarding', { replace: true })
      } else {
        navigate('/', { replace: true })
      }
    } else {
      setError(t('oauth.missingTokens'))
    }
  }, [searchParams, setTokens, navigate, t])

  if (error) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center p-4">
        <Card className="w-full max-w-sm">
          <CardHeader className="text-center">
            <CardTitle className="text-xl text-red-600">{t('oauth.errorTitle')}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-center">
            <p className="text-sm text-muted-foreground">{error}</p>
            <a
              href="/login"
              className="inline-block text-sm text-primary underline underline-offset-4"
            >
              {t('oauth.backToLogin')}
            </a>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
          <CardTitle>{t('oauth.processing')}</CardTitle>
        </CardHeader>
        <CardContent className="flex justify-center">
          <svg
            className="h-8 w-8 animate-spin text-primary"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        </CardContent>
      </Card>
    </div>
  )
}
