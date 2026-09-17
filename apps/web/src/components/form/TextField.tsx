import { useFieldContext } from '#/hooks/use-form'
import { cn } from 'cn'

type TextFieldProps = {
  label: string
  type?: string
  placeholder?: string
  autoComplete?: string
  readOnly?: boolean
}

export function TextField({ label, type = 'text', placeholder, autoComplete, readOnly }: TextFieldProps) {
  const field = useFieldContext<string>()
  const error = field.state.meta.isTouched ? field.state.meta.errors[0] : undefined

  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={field.name} className="text-sm font-medium">
        {label}
      </label>
      <input
        id={field.name}
        name={field.name}
        type={type}
        placeholder={placeholder}
        autoComplete={autoComplete}
        readOnly={readOnly}
        value={field.state.value}
        onBlur={field.handleBlur}
        onChange={(e) => field.handleChange(e.target.value)}
        className={cn(
          'px-3 py-2 outline-none shadow-dark focus:shadow-dark-active focus:translate-0.5 transition-all border text-sm rounded-md',
          readOnly && 'bg-muted text-muted-foreground cursor-not-allowed focus:shadow-dark focus:translate-0',
        )}
      />
      {error && <span className="text-sm text-destructive mt-2 font-semibold">{error?.message ?? String(error)}</span>}
    </div>
  )
}
