/**
 * @file VerifyContactPage.tsx
 * @description Public page for emergency contacts to verify their status
 * @task TASK-033
 * @design_state_version 2.0.0
 */

import { useSearchParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api'
import { CheckCircle, XCircle, Clock, AlertTriangle, Loader2 } from 'lucide-react'

// DONE(B): Implemented VerifyContactPage - TASK-033
export function VerifyContactPage(): JSX.Element {
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token')

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['verify-contact', token],
    queryFn: async () => {
      const response = await api.verification.verifyContact(token!)
      return response.data
    },
    enabled: !!token,
    retry: false,
  })

  // No token provided
  if (!token) {
    return (
      <VerificationLayout>
        <StatusCard
          icon={<AlertTriangle className="w-16 h-16 text-yellow-500" />}
          title="Missing Token"
          description="No verification token was provided. Please check your email link."
          variant="warning"
        />
      </VerificationLayout>
    )
  }

  // Loading state
  if (isLoading) {
    return (
      <VerificationLayout>
        <StatusCard
          icon={<Loader2 className="w-16 h-16 text-blue-500 animate-spin" />}
          title="Verifying..."
          description="Please wait while we verify your contact status."
          variant="loading"
        />
      </VerificationLayout>
    )
  }

  // Error state
  if (isError) {
    const errorMessage = getErrorMessage(error)
    const isExpired = errorMessage.toLowerCase().includes('expired')

    return (
      <VerificationLayout>
        <StatusCard
          icon={isExpired
            ? <Clock className="w-16 h-16 text-yellow-500" />
            : <XCircle className="w-16 h-16 text-red-500" />
          }
          title={isExpired ? 'Link Expired' : 'Invalid Link'}
          description={isExpired
            ? 'This verification link has expired. Please ask the user to send a new verification email.'
            : 'This verification link is invalid or has already been used.'
          }
          variant={isExpired ? 'warning' : 'error'}
        />
      </VerificationLayout>
    )
  }

  // Success state
  if (data?.success) {
    return (
      <VerificationLayout>
        <StatusCard
          icon={<CheckCircle className="w-16 h-16 text-green-500" />}
          title="Verification Complete!"
          description={`You are now verified as an emergency contact for ${data.userName}.`}
          variant="success"
        >
          <p className="text-gray-600 mt-4 text-sm">
            You will receive notifications if {data.userName} misses their daily check-in.
          </p>
        </StatusCard>
      </VerificationLayout>
    )
  }

  return (
    <VerificationLayout>
      <StatusCard
        icon={<AlertTriangle className="w-16 h-16 text-yellow-500" />}
        title="Unexpected Error"
        description="Something went wrong. Please try again later."
        variant="error"
      />
    </VerificationLayout>
  )
}

// Layout wrapper for verification page
function VerificationLayout({ children }: { children: React.ReactNode }): JSX.Element {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 flex flex-col items-center justify-center p-4">
      {/* Logo/Branding */}
      <div className="mb-8 text-center">
        <h1 className="text-2xl font-bold text-slate-800">Solo Guardian</h1>
        <p className="text-slate-500 text-sm">Keeping loved ones safe</p>
      </div>

      {children}

      {/* Footer */}
      <div className="mt-8 text-center text-slate-400 text-xs">
        <p>&copy; {new Date().getFullYear()} Solo Guardian. All rights reserved.</p>
      </div>
    </div>
  )
}

// Status card component for different states
interface StatusCardProps {
  icon: React.ReactNode
  title: string
  description: string
  variant: 'success' | 'error' | 'warning' | 'loading'
  children?: React.ReactNode
}

function StatusCard({ icon, title, description, variant, children }: StatusCardProps): JSX.Element {
  const borderColors = {
    success: 'border-green-200',
    error: 'border-red-200',
    warning: 'border-yellow-200',
    loading: 'border-blue-200',
  }

  return (
    <div className={`bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center border-t-4 ${borderColors[variant]}`}>
      <div className="flex justify-center mb-4">
        {icon}
      </div>
      <h2 className="text-xl font-semibold text-slate-800 mb-2">{title}</h2>
      <p className="text-slate-600">{description}</p>
      {children}
    </div>
  )
}

// Extract error message from API error
function getErrorMessage(error: unknown): string {
  if (error && typeof error === 'object' && 'response' in error) {
    const axiosError = error as { response?: { data?: { message?: string } } }
    if (axiosError.response?.data?.message) {
      return axiosError.response.data.message
    }
  }
  if (error instanceof Error) {
    return error.message
  }
  return 'Unknown error'
}
