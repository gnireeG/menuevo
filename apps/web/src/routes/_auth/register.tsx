import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { useState } from 'react'
import { z } from 'zod'
import { authClient } from '#/auth/auth-client'
import { useAppForm } from '#/hooks/use-form'

export const Route = createFileRoute('/_auth/register')({
  component: RouteComponent,
})

const registerSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.email('Enter a valid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
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
            navigate({ to: '/admin' })
          },
          onError: ({ error }) => {
            setFormError(error.message)
          },
        },
      )
    },
  })

  return (
    <div className="flex flex-col gap-4 w-80">
      <div>
        <h1 className="heading-1">Register</h1>
        <p>Create your account to start storing your favorite code snippits!</p>
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
          {(field) => <field.TextField label="Name" autoComplete="name" />}
        </form.AppField>

        <form.AppField name="email">
          {(field) => <field.TextField label="Email" type="email" autoComplete="email" />}
        </form.AppField>

        <form.AppField name="password">
          {(field) => (
            <field.TextField label="Password" type="password" autoComplete="new-password" />
          )}
        </form.AppField>

        {formError && <span className="text-sm text-red-600">{formError}</span>}

        <form.AppForm>
          <form.SubmitButton>Create account</form.SubmitButton>
        </form.AppForm>
      </form>

      <p className="text-sm">
        Already have an account?{' '}
        <Link to="/login" className="text-primary underline">
          Log in
        </Link>
      </p>
    </div>
  )
}
