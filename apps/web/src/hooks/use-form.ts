import { createFormHook, createFormHookContexts } from '@tanstack/react-form'
import { TextField } from '#/components/form/TextField'
import { SubmitButton } from '#/components/form/SubmitButton'
import { OtpField } from '#/components/form/OtpField'

export const { fieldContext, formContext, useFieldContext, useFormContext } =
  createFormHookContexts()

export const { useAppForm } = createFormHook({
  fieldContext,
  formContext,
  fieldComponents: {
    TextField,
    OtpField,
  },
  formComponents: {
    SubmitButton,
  },
  
})
