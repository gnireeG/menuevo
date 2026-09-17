import { useFieldContext } from '#/hooks/use-form'
import { InputOTP, InputOTPGroup, InputOTPSlot } from '#/components/ui/input-otp'

type OtpFieldProps = {
  label: string
  length?: number
  onComplete?: () => void
}

export function OtpField({ label, length = 6, onComplete }: OtpFieldProps) {
  const field = useFieldContext<string>()
  const error = field.state.meta.isTouched ? field.state.meta.errors[0] : undefined

  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={field.name} className="text-sm font-medium">
        {label}
      </label>
      <InputOTP
        id={field.name}
        name={field.name}
        maxLength={length}
        autoComplete="one-time-code"
        value={field.state.value}
        onChange={field.handleChange}
        onBlur={field.handleBlur}
        onComplete={onComplete}
      >
        <InputOTPGroup>
          {Array.from({ length }, (_, index) => (
            <InputOTPSlot key={index} index={index} />
          ))}
        </InputOTPGroup>
      </InputOTP>
      {error && <span className="text-sm text-destructive mt-2 font-semibold">{error?.message ?? String(error)}</span>}
    </div>
  )
}
