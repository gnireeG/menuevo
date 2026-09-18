import { useFieldContext } from '#/hooks/use-form'
import { cn } from 'cn'
import { Input } from '../ui/input'

/**
 * Input types whose value round-trips as a string via `e.target.value`.
 * Excludes checkbox/radio/file/range/color and the button-like types,
 * which this field cannot drive from a string form value.
 */
type TextFieldType =
  | 'text'
  | 'email'
  | 'password'
  | 'search'
  | 'tel'
  | 'url'
  | 'number'
  | 'date'
  | 'datetime-local'
  | 'month'
  | 'time'
  | 'week'

type TextFieldProps = React.ComponentProps<"input"> & {
  label?: string
}

export function TextField({ label, type = 'text', placeholder, autoComplete, readOnly }: TextFieldProps) {
  const field = useFieldContext<string>()
  const error = field.state.meta.isTouched ? field.state.meta.errors[0] : undefined

  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label htmlFor={field.name} className="text-sm font-medium">
          {label}
        </label>
      )}
      <Input
        id={field.name}
        name={field.name}
        type={type}
        placeholder={placeholder}
        autoComplete={autoComplete}
        readOnly={readOnly}
        value={field.state.value}
        onBlur={field.handleBlur}
        onChange={(e) => field.handleChange(e.target.value)}
      />
      {error && <span className="text-sm text-destructive mt-2 font-semibold">{error?.message ?? String(error)}</span>}
    </div>
  )
}
