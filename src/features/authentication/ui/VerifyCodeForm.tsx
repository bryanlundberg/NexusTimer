'use client'

import { useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useTranslations } from 'next-intl'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { createVerifyCodeSchema, type VerifyCodeValues } from '@/features/authentication/model/schemas'
import { useAuthSchemaMessages } from '@/features/authentication/model/use-auth-schema-messages'
import { useVerifyCode } from '@/features/authentication/model/hooks/use-verify-code'
import OtpInput from '@/features/authentication/ui/OtpInput'

const CODE_LENGTH = 6

interface Props {
  email: string
  password: string
}

export default function VerifyCodeForm({ email, password }: Props) {
  const router = useRouter()
  const t = useTranslations('Index.Auth')
  const messages = useAuthSchemaMessages()
  const schema = useMemo(() => createVerifyCodeSchema(messages), [messages])

  const { verify, isLoading } = useVerifyCode()
  const [formError, setFormError] = useState('')

  const {
    setValue,
    watch,
    handleSubmit,
    formState: { errors }
  } = useForm<VerifyCodeValues>({
    resolver: zodResolver(schema),
    defaultValues: { code: '' }
  })

  const code = watch('code')

  const onSubmit = async (values: VerifyCodeValues) => {
    setFormError('')
    const result = await verify({ email, password, values })
    if (!result.ok) {
      setFormError(result.message)
      setValue('code', '')
      return
    }
    router.push('/app')
    router.refresh()
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <Label htmlFor="code" className="text-center">
          {t('verification-code')}
        </Label>
        <div className="flex justify-center">
          <OtpInput
            value={code}
            onChange={(value) => setValue('code', value, { shouldValidate: true })}
            length={CODE_LENGTH}
            autoFocus
          />
        </div>
        {errors.code && <p className="text-xs text-destructive text-center">{errors.code.message}</p>}
      </div>

      {formError && <p className="text-sm text-destructive text-center">{formError}</p>}

      <Button
        type="submit"
        disabled={isLoading || code.length !== CODE_LENGTH}
        className="w-full h-10 font-semibold tracking-wide"
      >
        {isLoading ? t('loading') : t('verify-button')}
      </Button>
    </form>
  )
}
