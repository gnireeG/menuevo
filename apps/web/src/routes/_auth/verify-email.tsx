import { createFileRoute, redirect, useNavigate } from '@tanstack/react-router'
import { useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { z } from 'zod'
import { authClient } from '#/auth/auth-client'
import { authQueryKey } from '#/auth/query'
import { ResendOtpButton } from '#/components/auth/ResendOtpButton'
import { useAppForm } from '#/hooks/use-form'
import * as m from '#/paraglide/messages'

const verifyEmailSearchSchema = z.object({
  email: z.email().optional(),
})

export const Route = createFileRoute('/_auth/verify-email')({
  validateSearch: verifyEmailSearchSchema,
  beforeLoad: ({ context, search }) => {
    if (context.session?.user.emailVerified) {
      throw redirect({ to: '/admin' })
    }
    // Opened without `?email=` - recover it from the session, otherwise there
    // is nothing to verify and the user has to sign in first.
    if (!search.email) {
      const sessionEmail = context.session?.user.email
      if (!sessionEmail) {
        throw redirect({ to: '/login' })
      }
      throw redirect({ to: '/verify-email', search: { email: sessionEmail } })
    }
  },
  component: RouteComponent,
})

const verifyEmailSchema = z.object({
  email: z.email(m['auth.validation.email_invalid']()),
  otp: z.string().length(6, m['auth.validation.otp_length']()),
})

function RouteComponent() {
  // `beforeLoad` guarantees the search param is present.
  const { email = '' } = Route.useSearch()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [formError, setFormError] = useState<string | null>(null)
  const [info, setInfo] = useState<string | null>(null)

  const form = useAppForm({
    defaultValues: {
      email,
      otp: '',
    },
    validators: {
      onSubmit: verifyEmailSchema,
    },
    onSubmit: async ({ value }) => {
      setFormError(null)
      setInfo(null)

      const { data, error } = await authClient.emailOtp.verifyEmail({
        email: value.email,
        otp: value.otp,
      })

      if (error || !data?.status) {
        form.setFieldValue('otp', '')
        setFormError(error?.message ?? m['auth.verify_email_failed']())
        return
      }

      // `autoSignInAfterVerification` creates the session, so the cached
      // session has to be refetched before we enter the guarded area.
      await queryClient.invalidateQueries({ queryKey: authQueryKey })
      navigate({ to: '/admin' })
    },
  })

  const handleResend = async () => {
    setFormError(null)
    setInfo(null)

    const { error } = await authClient.emailOtp.sendVerificationOtp({
      email,
      type: 'email-verification',
    })

    if (error) {
      setFormError(error.message ?? m['auth.verify_email_failed']())
      return false
    }

    setInfo(m['auth.verify_email_resent']())
  }

  return (
    <div className="flex flex-col gap-4 w-80">
      <div>
        <h1 className="heading-1">{m['auth.verify_email_title']()}</h1>
        <p>{m['auth.verify_email_description']()}</p>
      </div>

      <form
        className="flex flex-col gap-4"
        onSubmit={(e) => {
          e.preventDefault()
          e.stopPropagation()
          form.handleSubmit()
        }}
      >
        <form.AppField name="email">
          {(field) => (
            <field.TextField
              label={m['auth.form_labels.email']()}
              type="email"
              autoComplete="email"
              readOnly
            />
          )}
        </form.AppField>

        <form.AppField name="otp">
          {(field) => (
            <field.OtpField
              label={m['auth.form_labels.otp']()}
              onComplete={() => form.handleSubmit()}
            />
          )}
        </form.AppField>

        {formError && <span className="text-sm text-destructive font-semibold">{formError}</span>}
        {info && <span className="text-sm text-muted-foreground">{info}</span>}

        <form.AppForm>
          <form.SubmitButton>{m['auth.verify_email_submit']()}</form.SubmitButton>
        </form.AppForm>
      </form>

      <ResendOtpButton onResend={handleResend} />
    </div>
  )
}
