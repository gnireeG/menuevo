import { createFormHook, createFormHookContexts } from '@tanstack/react-form'
import { TextField } from '#/components/form/TextField'
import { SubmitButton } from '#/components/form/SubmitButton'

export const { fieldContext, formContext, useFieldContext, useFormContext } =
  createFormHookContexts()

export const { useAppForm } = createFormHook({
  fieldContext,
  formContext,
  fieldComponents: {
    TextField,
  },
  formComponents: {
    SubmitButton,
  },
})
