/**
 * @file PhoneVerificationDialog.tsx
 * @description OTP verification dialog for phone number verification
 * @task TASK-037
 * @design_state_version 3.4.0
 */
import { useState, useEffect, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { Loader2, CheckCircle2, Phone } from 'lucide-react'
import { hooks } from '@/lib/api'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import type { EmergencyContact } from '@solo-guardian/api-client'

interface PhoneVerificationDialogProps {
  open: boolean
  contact: EmergencyContact | null
  onClose: () => void
  onSuccess: () => void
}

type VerificationStep = 'send' | 'verify' | 'success'

const RESEND_COOLDOWN_SECONDS = 30
const OTP_LENGTH = 6

// DONE(B): Implemented PhoneVerificationDialog - TASK-037
export function PhoneVerificationDialog({
  open,
  contact,
  onClose,
  onSuccess,
}: PhoneVerificationDialogProps): JSX.Element {
  const { t } = useTranslation('contacts')
  const { t: tCommon } = useTranslation('common')

  const sendMutation = hooks.useSendPhoneVerification()
  const verifyMutation = hooks.useVerifyPhone()
  const resendMutation = hooks.useResendPhoneVerification()

  const [step, setStep] = useState<VerificationStep>('send')
  const [otp, setOtp] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [cooldown, setCooldown] = useState(0)

  const isPending = sendMutation.isPending || verifyMutation.isPending || resendMutation.isPending

  // Reset state when dialog opens - batch state updates for dialog initialization
  useEffect(() => {
    if (open) {
      queueMicrotask(() => {
        setStep('send')
        setOtp('')
        setError(null)
        setCooldown(0)
      })
    }
  }, [open])

  // Cooldown timer for resend button
  useEffect(() => {
    if (cooldown <= 0) return

    const timer = setInterval(() => {
      setCooldown((prev) => Math.max(0, prev - 1))
    }, 1000)

    return () => clearInterval(timer)
  }, [cooldown])

  const handleSendCode = useCallback((): void => {
    if (!contact) return

    setError(null)
    sendMutation.mutate(contact.id, {
      onSuccess: () => {
        setStep('verify')
        setCooldown(RESEND_COOLDOWN_SECONDS)
      },
      onError: () => {
        setError(t('phoneVerification.errors.sendFailed'))
      },
    })
  }, [contact, sendMutation, t])

  const handleVerifyCode = useCallback((): void => {
    if (!contact) return

    if (otp.length !== OTP_LENGTH) {
      setError(t('phoneVerification.errors.invalidOtp'))
      return
    }

    setError(null)
    verifyMutation.mutate(
      { contactId: contact.id, otp },
      {
        onSuccess: () => {
          setStep('success')
          setTimeout(() => {
            onSuccess()
            onClose()
          }, 1500)
        },
        onError: () => {
          setError(t('phoneVerification.errors.verifyFailed'))
        },
      }
    )
  }, [contact, otp, verifyMutation, t, onSuccess, onClose])

  const handleResendCode = useCallback((): void => {
    if (!contact || cooldown > 0) return

    setError(null)
    resendMutation.mutate(contact.id, {
      onSuccess: () => {
        setCooldown(RESEND_COOLDOWN_SECONDS)
        setError(null)
      },
      onError: () => {
        setError(t('phoneVerification.errors.resendFailed'))
      },
    })
  }, [contact, cooldown, resendMutation, t])

  const handleOtpChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const value = e.target.value.replace(/\D/g, '').slice(0, OTP_LENGTH)
    setOtp(value)
  }

  const renderSendStep = (): JSX.Element => (
    <>
      <DialogHeader>
        <DialogTitle>{t('phoneVerification.title')}</DialogTitle>
        <DialogDescription>
          {t('phoneVerification.sendDescription', { phone: contact?.phone })}
        </DialogDescription>
      </DialogHeader>

      <div className="flex items-center justify-center py-6">
        <Phone className="h-12 w-12 text-muted-foreground" />
      </div>

      <DialogFooter>
        <Button variant="outline" onClick={onClose} disabled={isPending}>
          {tCommon('cancel')}
        </Button>
        <Button onClick={handleSendCode} disabled={isPending}>
          {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {t('phoneVerification.sendCode')}
        </Button>
      </DialogFooter>
    </>
  )

  const renderVerifyStep = (): JSX.Element => (
    <>
      <DialogHeader>
        <DialogTitle>{t('phoneVerification.enterCode')}</DialogTitle>
        <DialogDescription>
          {t('phoneVerification.verifyDescription', { phone: contact?.phone })}
        </DialogDescription>
      </DialogHeader>

      <div className="space-y-4 py-4">
        <div className="space-y-2">
          <Label htmlFor="otp">{t('phoneVerification.otpLabel')}</Label>
          <Input
            id="otp"
            value={otp}
            onChange={handleOtpChange}
            placeholder="000000"
            maxLength={OTP_LENGTH}
            className="text-center text-2xl tracking-widest"
            autoComplete="one-time-code"
          />
          {error && <p className="text-sm text-destructive">{error}</p>}
        </div>

        <div className="text-center">
          <Button
            variant="link"
            onClick={handleResendCode}
            disabled={cooldown > 0 || isPending}
            className="text-sm"
          >
            {cooldown > 0
              ? t('phoneVerification.resendCooldown', { seconds: cooldown })
              : t('phoneVerification.resendCode')}
          </Button>
        </div>
      </div>

      <DialogFooter>
        <Button variant="outline" onClick={onClose} disabled={isPending}>
          {tCommon('cancel')}
        </Button>
        <Button onClick={handleVerifyCode} disabled={isPending || otp.length !== OTP_LENGTH}>
          {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {t('phoneVerification.verify')}
        </Button>
      </DialogFooter>
    </>
  )

  const renderSuccessStep = (): JSX.Element => (
    <>
      <DialogHeader>
        <DialogTitle>{t('phoneVerification.successTitle')}</DialogTitle>
        <DialogDescription>
          {t('phoneVerification.successDescription')}
        </DialogDescription>
      </DialogHeader>

      <div className="flex items-center justify-center py-6">
        <CheckCircle2 className="h-16 w-16 text-green-500" />
      </div>
    </>
  )

  return (
    <Dialog open={open} onOpenChange={(isOpen: boolean) => !isOpen && onClose()}>
      <DialogContent className="sm:max-w-[400px]">
        {step === 'send' && renderSendStep()}
        {step === 'verify' && renderVerifyStep()}
        {step === 'success' && renderSuccessStep()}
      </DialogContent>
    </Dialog>
  )
}
