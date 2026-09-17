import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { useState } from 'react'
import { z } from 'zod'
import { authClient } from '#/auth/auth-client'
import { useAppForm } from '#/hooks/use-form'
import * as m from '#/paraglide/messages'

export const Route = createFileRoute('/_auth/_not-authed/register')({
  component: RouteComponent,
})

const registerSchema = z.object({
  name: z.string().min(1, m['auth.validation.name_required']()),
  email: z.email(m['auth.validation.email_invalid']()),
  password: z.string().min(8, m['auth.validation.password_min']()),
})

function RouteComponent() {
  const navigate = useNavigate()
  const [formError, setFormError] = useState<string | null>(null)

  const form = useAppForm({
    defaultValues: {
      name: '',
      email: '',
      password: '',
    },
    validators: {
      onSubmit: registerSchema,
    },
    onSubmit: async ({ value }) => {
      setFormError(null)
      await authClient.signUp.email(
        {
          name: value.name,
          email: value.email,
          password: value.password,
        },
        {
          onSuccess: () => {
            navigate({ to: '/verify-email', search: { email: value.email } })
          },
          onError: ({ error }) => {
            setFormError(error.message)
          },
        },
      )
    },
  })

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h1 className="heading-1">{m['auth.register_title']()}</h1>
        <p>{m['auth.register_description']()}</p>
      </div>

      <form
        className="flex flex-col gap-4"
        onSubmit={(e) => {
          e.preventDefault()
          e.stopPropagation()
          form.handleSubmit()
        }}
      >
        <form.AppField name="name">
          {(field) => (
            <field.TextField label={m['auth.form_labels.name']()} autoComplete="name" />
          )}
        </form.AppField>

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
              autoComplete="new-password"
            />
          )}
        </form.AppField>

        {formError && <span className="text-sm text-red-600">{formError}</span>}

        <form.AppForm>
          <form.SubmitButton>{m['auth.register_submit']()}</form.SubmitButton>
        </form.AppForm>
      </form>

      <p className="text-sm">
        {m['auth.register_has_account']()}{' '}
        <Link to="/login" className="text-primary underline">
          {m['auth.register_login_link']()}
        </Link>
      </p>
    </div>
  )
}
