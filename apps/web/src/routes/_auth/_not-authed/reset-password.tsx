import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { useState } from 'react'
import { z } from 'zod'
import { authClient } from '#/auth/auth-client'
import { ResendOtpButton } from '#/components/auth/ResendOtpButton'
import { Button } from '#/components/ui/button'
import { useAppForm } from '#/hooks/use-form'
import * as m from '#/paraglide/messages'

export const Route = createFileRoute('/_auth/_not-authed/reset-password')({
  component: RouteComponent,
})

const requestSchema = z.object({
  email: z.email(m['auth.validation.email_invalid']()),
})

const resetSchema = z
  .object({
    otp: z.string().length(6, m['auth.validation.otp_length']()),
    password: z.string().min(8, m['auth.validation.password_min']()),
    confirmPassword: z.string(),
  })
  .refine((value) => value.password === value.confirmPassword, {
    message: m['auth.validation.password_mismatch'](),
    path: ['confirmPassword'],
  })

function RouteComponent() {
  const navigate = useNavigate()
  const [stage, setStage] = useState<'request' | 'reset'>('request')
  const [email, setEmail] = useState('')
  const [formError, setFormError] = useState<string | null>(null)
  const [info, setInfo] = useState<string | null>(null)

  /**
   * Always reports success, even for unknown addresses – the endpoint
   * deliberately does not leak whether an account exists.
   */
  const requestOtp = async (address: string) => {
    const { error } = await authClient.emailOtp.requestPasswordReset({ email: address })

    if (error) {
      setFormError(error.message ?? m['auth.reset_password_failed']())
      return false
    }

    setInfo(m['auth.reset_password_otp_sent']())
    return true
  }

  const requestForm = useAppForm({
    defaultValues: {
      email: '',
    },
    validators: {
      onSubmit: requestSchema,
    },
    onSubmit: async ({ value }) => {
      setFormError(null)
      setInfo(null)

      if (!(await requestOtp(value.email))) return

      setEmail(value.email)
      setStage('reset')
    },
  })

  const resetForm = useAppForm({
    defaultValues: {
      otp: '',
      password: '',
      confirmPassword: '',
    },
    validators: {
      onSubmit: resetSchema,
    },
    onSubmit: async ({ value }) => {
      setFormError(null)
      setInfo(null)

      const { error } = await authClient.emailOtp.resetPassword({
        email,
        otp: value.otp,
        password: value.password,
      })

      if (error) {
        resetForm.setFieldValue('otp', '')
        setFormError(error.message ?? m['auth.reset_password_failed']())
        return
      }

      navigate({ to: '/login' })
    },
  })

  const handleBackToRequest = () => {
    setFormError(null)
    setInfo(null)
    resetForm.reset()
    setStage('request')
  }

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h1 className="heading-1">{m['auth.reset_password_title']()}</h1>
        <p>
          {stage === 'request'
            ? m['auth.reset_password_request_description']()
            : m['auth.reset_password_reset_description']()}
        </p>
      </div>

      {stage === 'request' ? (
        <form
          className="flex flex-col gap-4"
          onSubmit={(e) => {
            e.preventDefault()
            e.stopPropagation()
            requestForm.handleSubmit()
          }}
        >
          <requestForm.AppField name="email">
            {(field) => (
              <field.TextField
                label={m['auth.form_labels.email']()}
                type="email"
                autoComplete="email"
              />
            )}
          </requestForm.AppField>

          {formError && <span className="text-sm text-destructive font-semibold">{formError}</span>}

          <requestForm.AppForm>
            <requestForm.SubmitButton>
              {m['auth.reset_password_request_submit']()}
            </requestForm.SubmitButton>
          </requestForm.AppForm>
        </form>
      ) : (
        <form
          className="flex flex-col gap-4"
          onSubmit={(e) => {
            e.preventDefault()
            e.stopPropagation()
            resetForm.handleSubmit()
          }}
        >
          <div className="flex flex-col gap-1">
            <label htmlFor="reset-password-email" className="text-sm font-medium">
              {m['auth.form_labels.email']()}
            </label>
            <input
              id="reset-password-email"
              type="email"
              value={email}
              readOnly
              className="px-3 py-2 outline-none shadow-dark transition-all border text-sm rounded-md bg-muted text-muted-foreground cursor-not-allowed"
            />
          </div>

          <resetForm.AppField name="otp">
            {(field) => <field.OtpField label={m['auth.form_labels.otp']()} />}
          </resetForm.AppField>

          <resetForm.AppField name="password">
            {(field) => (
              <field.TextField
                label={m['auth.form_labels.new_password']()}
                type="password"
                autoComplete="new-password"
              />
            )}
          </resetForm.AppField>

          <resetForm.AppField name="confirmPassword">
            {(field) => (
              <field.TextField
                label={m['auth.form_labels.confirm_password']()}
                type="password"
                autoComplete="new-password"
              />
            )}
          </resetForm.AppField>

          {formError && <span className="text-sm text-destructive font-semibold">{formError}</span>}
          {info && <span className="text-sm text-muted-foreground">{info}</span>}

          <resetForm.AppForm>
            <resetForm.SubmitButton>
              {m['auth.reset_password_reset_submit']()}
            </resetForm.SubmitButton>
          </resetForm.AppForm>

          <div className="flex items-center justify-between">
            <ResendOtpButton onResend={() => requestOtp(email)} />
            <Button type="button" variant="ghost" onClick={handleBackToRequest}>
              {m['auth.reset_password_wrong_email']()}
            </Button>
          </div>
        </form>
      )}

      <p className="text-sm">
        <Link to="/login" className="text-primary underline">
          {m['auth.reset_password_back_to_login']()}
        </Link>
      </p>
    </div>
  )
}
