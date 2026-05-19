'use client'

import { useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useTranslations } from 'next-intl'
import { Button } from '@/components/ui/button'
import { createForgotPasswordSchema, type ForgotPasswordValues } from '@/features/authentication/model/schemas'
import { useAuthSchemaMessages } from '@/features/authentication/model/use-auth-schema-messages'
import { useForgotPassword } from '@/features/authentication/model/hooks/use-forgot-password'
import AuthField from '@/features/authentication/ui/AuthField'

export default function ForgotPasswordForm() {
  const t = useTranslations('Index.Auth')
  const messages = useAuthSchemaMessages()
  const schema = useMemo(() => createForgotPasswordSchema(messages), [messages])

  const { request, isLoading } = useForgotPassword()
  const [sentTo, setSentTo] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<ForgotPasswordValues>({
    resolver: zodResolver(schema),
    defaultValues: { email: '' }
  })

  const onSubmit = async (values: ForgotPasswordValues) => {
    const result = await request(values)
    if (result.ok) setSentTo(values.email)
  }

  if (sentTo) {
    return (
      <div className="flex flex-col gap-2 text-center">
        <h2 className="text-xl font-bold tracking-tight">{t('forgot-password-sent-title')}</h2>
        <p className="text-sm text-muted-foreground">{t('forgot-password-sent-description', { email: sentTo })}</p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <AuthField
        id="email"
        label={t('email')}
        type="email"
        autoComplete="email"
        placeholder="you@example.com"
        error={errors.email?.message}
        {...register('email')}
      />

      <Button type="submit" disabled={isLoading} className="w-full h-10 font-semibold tracking-wide">
        {isLoading ? t('loading') : t('forgot-password-submit')}
      </Button>
    </form>
  )
}
