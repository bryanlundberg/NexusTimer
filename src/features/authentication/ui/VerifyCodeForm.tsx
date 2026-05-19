'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useTranslations } from 'next-intl'
import { Button } from '@/components/ui/button'
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp'
import { Label } from '@/components/ui/label'
import { verifyCodeSchema, type VerifyCodeValues } from '@/features/authentication/model/schemas'
import { useVerifyCode } from '@/features/authentication/model/use-credentials-auth'

interface Props {
  email: string
  password: string
}

export default function VerifyCodeForm({ email, password }: Props) {
  const router = useRouter()
  const t = useTranslations('Index.Auth')
  const { verify, isLoading } = useVerifyCode()
  const [formError, setFormError] = useState('')

  const {
    setValue,
    watch,
    handleSubmit,
    formState: { errors }
  } = useForm<VerifyCodeValues>({
    resolver: zodResolver(verifyCodeSchema),
    defaultValues: { code: '' }
  })

  const code = watch('code')

  const onSubmit = async (values: VerifyCodeValues) => {
    setFormError('')
    const result = await verify(email, password, values)
    if (!result.ok) {
      setFormError(result.message)
      setValue('code', '')
      return
    }
    router.push('/')
    router.refresh()
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <Label htmlFor="code" className="text-center">
          {t('verification-code')}
        </Label>
        <div className="flex justify-center">
          <InputOTP
            maxLength={6}
            value={code}
            onChange={(value) => setValue('code', value, { shouldValidate: true })}
            autoFocus
          >
            <InputOTPGroup>
              <InputOTPSlot index={0} className="h-12 w-12 text-lg" />
              <InputOTPSlot index={1} className="h-12 w-12 text-lg" />
              <InputOTPSlot index={2} className="h-12 w-12 text-lg" />
              <InputOTPSlot index={3} className="h-12 w-12 text-lg" />
              <InputOTPSlot index={4} className="h-12 w-12 text-lg" />
              <InputOTPSlot index={5} className="h-12 w-12 text-lg" />
            </InputOTPGroup>
          </InputOTP>
        </div>
        {errors.code && <p className="text-xs text-destructive text-center">{errors.code.message}</p>}
      </div>

      {formError && <p className="text-sm text-destructive text-center">{formError}</p>}

      <Button
        type="submit"
        disabled={isLoading || code.length !== 6}
        className="w-full h-10 font-semibold tracking-wide"
      >
        {isLoading ? t('loading') : t('verify-button')}
      </Button>
    </form>
  )
}
