import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { useState } from 'react'
import { z } from 'zod'
import { authClient } from '#/auth/auth-client'
import { useAppForm } from '#/hooks/use-form'
import { useQueryClient } from '@tanstack/react-query'
import { authQueryKey } from '#/auth/query'

export const Route = createFileRoute('/_auth/login')({
  component: RouteComponent,
})

const loginSchema = z.object({
  email: z.email('Enter a valid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
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
            setFormError(error.message)
          },
        },
      )
    },
  })

  return (
    <div className="flex flex-col gap-4 w-80">
      <div>
        <h1 className="heading-1">Login</h1>
        <p>Welcome back! Log in to access your code snippits.</p>
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
          {(field) => <field.TextField label="Email" type="email" autoComplete="email" />}
        </form.AppField>

        <form.AppField name="password">
          {(field) => (
            <field.TextField label="Password" type="password" autoComplete="current-password" />
          )}
        </form.AppField>

        {formError && <span className="text-sm text-red-600">{formError}</span>}

        <form.AppForm>
          <form.SubmitButton>Log in</form.SubmitButton>
        </form.AppForm>
      </form>

      <p className="text-sm">
        Don't have an account?{' '}
        <Link to="/register" className="text-primary underline">
          Register
        </Link>
      </p>
    </div>
  )
}
