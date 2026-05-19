import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp'

interface Props {
  value: string
  onChange: (value: string) => void
  length?: number
  autoFocus?: boolean
}

export default function OtpInput({ value, onChange, length = 6, autoFocus }: Props) {
  return (
    <InputOTP maxLength={length} value={value} onChange={onChange} autoFocus={autoFocus}>
      <InputOTPGroup>
        {Array.from({ length }, (_, index) => (
          <InputOTPSlot key={index} index={index} className="h-12 w-12 text-lg" />
        ))}
      </InputOTPGroup>
    </InputOTP>
  )
}
