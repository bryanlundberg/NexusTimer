'use client'

import { useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useTranslations } from 'next-intl'
import { Button } from '@/components/ui/button'
import { createResetPasswordSchema, type ResetPasswordValues } from '@/features/authentication/model/schemas'
import { useAuthSchemaMessages } from '@/features/authentication/model/use-auth-schema-messages'
import { useResetPassword } from '@/features/authentication/model/hooks/use-reset-password'
import { signInWithCredentials } from '@/features/authentication/model/sign-in-credentials'
import AuthField from '@/features/authentication/ui/AuthField'

interface Props {
  oobCode: string
}

export default function ResetPasswordForm({ oobCode }: Props) {
  const router = useRouter()
  const t = useTranslations('Index.Auth')
  const messages = useAuthSchemaMessages()
  const schema = useMemo(() => createResetPasswordSchema(messages), [messages])

  const { reset, isLoading } = useResetPassword()
  const [formError, setFormError] = useState('')

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<ResetPasswordValues>({
    resolver: zodResolver(schema),
    defaultValues: { password: '', confirmPassword: '' }
  })

  const onSubmit = async (values: ResetPasswordValues) => {
    setFormError('')
    const result = await reset({ oobCode, password: values.password })
    if (!result.ok) {
      setFormError(result.message)
      return
    }
    const signInResult = await signInWithCredentials(result.data.email, values.password)
    if (!signInResult.ok) {
      router.push('/sign-in')
      return
    }
    router.push('/app')
    router.refresh()
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <AuthField
        id="password"
        label={t('new-password')}
        type="password"
        autoComplete="new-password"
        placeholder="••••••••"
        error={errors.password?.message}
        {...register('password')}
      />
      <AuthField
        id="confirmPassword"
        label={t('confirm-password')}
        type="password"
        autoComplete="new-password"
        placeholder="••••••••"
        error={errors.confirmPassword?.message}
        {...register('confirmPassword')}
      />

      {formError && <p className="text-sm text-destructive">{formError}</p>}

      <Button type="submit" disabled={isLoading} className="w-full h-10 font-semibold tracking-wide">
        {isLoading ? t('loading') : t('reset-password-submit')}
      </Button>
    </form>
  )
}
