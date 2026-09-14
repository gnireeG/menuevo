import { useFormContext } from '#/hooks/use-form'
import { Button } from '#/components/ui/button'
import type { ComponentProps } from 'react'

type SubmitButtonProps = Omit<ComponentProps<typeof Button>, 'loading' | 'type'>

export function SubmitButton({ disabled, ...props }: SubmitButtonProps) {
  const form = useFormContext()

  return (
    <form.Subscribe selector={(state) => state.isSubmitting}>
      {(isSubmitting) => (
        <Button type="submit" loading={isSubmitting} disabled={disabled} {...props} />
      )}
    </form.Subscribe>
  )
}
