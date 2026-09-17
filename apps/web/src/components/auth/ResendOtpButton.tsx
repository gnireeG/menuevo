import { useEffect, useState } from 'react'
import { Button } from '#/components/ui/button'
import * as m from '#/paraglide/messages'

type ResendOtpButtonProps = {
  /** Sends a fresh OTP. Resolve with `false` to skip starting the cooldown. */
  onResend: () => Promise<boolean | void>
  /** Kept in sync with the server side rate limit of 3 requests per 60s. */
  cooldownSeconds?: number
}

export function ResendOtpButton({ onResend, cooldownSeconds = 60 }: ResendOtpButtonProps) {
  const [secondsLeft, setSecondsLeft] = useState(0)
  const [isSending, setIsSending] = useState(false)

  useEffect(() => {
    if (secondsLeft <= 0) return

    const timeout = setTimeout(() => setSecondsLeft((seconds) => seconds - 1), 1000)
    return () => clearTimeout(timeout)
  }, [secondsLeft])

  const handleClick = async () => {
    if (secondsLeft > 0 || isSending) return

    setIsSending(true)
    try {
      const started = await onResend()
      if (started !== false) setSecondsLeft(cooldownSeconds)
    } finally {
      setIsSending(false)
    }
  }

  return (
    <Button
      type="button"
      variant="ghost"
      loading={isSending}
      disabled={secondsLeft > 0}
      onClick={handleClick}
    >
      {secondsLeft > 0
        ? m['auth.verify_email_resend_cooldown']({ seconds: secondsLeft })
        : m['auth.verify_email_resend']()}
    </Button>
  )
}
