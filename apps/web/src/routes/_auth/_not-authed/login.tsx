import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { useState } from 'react'
import { z } from 'zod'
import { authClient } from '#/auth/auth-client'
import { signalUnknownCredential } from '#/auth/passkeys'
import { useAppForm } from '#/hooks/use-form'
import { useQueryClient } from '@tanstack/react-query'
import { authQueryKey } from '#/auth/query'
import * as m from '#/paraglide/messages'
import { Separator } from '#/components/ui/separator'
import { Button } from '#/components/ui/button'
import { GoogleLogoIcon, KeyIcon } from '@phosphor-icons/react'

export const Route = createFileRoute('/_auth/_not-authed/login')({
  component: RouteComponent,
})

const loginSchema = z.object({
  email: z.email(m['auth.validation.email_invalid']()),
  password: z.string().min(8, m['auth.validation.password_min']()),
})

function RouteComponent() {
  const navigate = useNavigate()
  const [formError, setFormError] = useState<string | null>(null)

  const queryClient = useQueryClient()

  const form = useAppForm({
    defaultValues: {
      email: '',
      password: '',
    },
    validators: {
      onSubmit: loginSchema,
    },
    onSubmit: async ({ value }) => {
      setFormError(null)
      await authClient.signIn.email(
        {
          email: value.email,
          password: value.password,
        },
        {
          onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: authQueryKey })
            navigate({ to: '/admin' })
          },
          onError: ({ error }) => {
            // Signing in with an unverified address is not an error the user
            // can fix here - send them to the OTP form instead.
            if (error.code === 'EMAIL_NOT_VERIFIED') {
              navigate({ to: '/verify-email', search: { email: value.email } })
              return
            }
            setFormError(error.message)
          },
        },
      )
    },
  })

  const handlePasskeyLogin = async () => {
    setFormError(null)
    // `returnWebAuthnResponse` hands us the credential the user picked, so a
    // passkey the server no longer knows can be reported back to the provider.
    const result = await authClient.signIn.passkey({ returnWebAuthnResponse: true })

    if (!result?.error) {
      await queryClient.invalidateQueries({ queryKey: authQueryKey })
      navigate({ to: '/admin' })
      return
    }

    // The passkey exists in the user's password manager but not in our
    // database - it was deleted here, or belongs to another environment.
    // Signal it so the provider drops the dead entry instead of offering it
    // again on every login.
    const { code } = result.error as { code?: string }
    const credentialId = 'webauthn' in result ? result.webauthn?.response.id : undefined
    if (credentialId && code === 'PASSKEY_NOT_FOUND') {
      await signalUnknownCredential(credentialId)
    }

    // Dismissing the browser prompt is a normal way out, not an error.
    if (code === 'AUTH_CANCELLED') return

    setFormError(result.error.message ?? null)
  }

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h1 className="heading-1">{m['auth.login_title']()}</h1>
        <p>{m['auth.login_description']()}</p>
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
            />
          )}
        </form.AppField>

        <form.AppField name="password">
          {(field) => (
            <field.TextField
              label={m['auth.form_labels.password']()}
              type="password"
              autoComplete="current-password"
            />
          )}
        </form.AppField>

        {formError && <span className="text-sm text-red-600">{formError}</span>}

        <form.AppForm>
          <form.SubmitButton>{m['auth.login_submit']()}</form.SubmitButton>
        </form.AppForm>
      </form>

      <Separator />

      <div className="flex gap-4 flex-wrap">
        <Button className="grow" onClick={handlePasskeyLogin}><KeyIcon />Passkey</Button>
        <Button className="grow"><GoogleLogoIcon />Google</Button>
      </div>

      <p className="text-sm">
        <Link to="/reset-password" className="text-primary underline">
          {m['auth.login_forgot_password']()}
        </Link>
      </p>

      <p className="text-sm">
        {m['auth.login_no_account']()}{' '}
        <Link to="/register" className="text-primary underline">
          {m['auth.login_register_link']()}
        </Link>
      </p>
    </div>
  )
}
