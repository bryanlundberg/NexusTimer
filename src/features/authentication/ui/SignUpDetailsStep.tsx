'use client'

import { useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useTranslations } from 'next-intl'
import { Button } from '@/components/ui/button'
import { createSignUpSchema, type SignUpValues } from '@/features/authentication/model/schemas'
import { useAuthSchemaMessages } from '@/features/authentication/model/use-auth-schema-messages'
import { useCredentialsRegister } from '@/features/authentication/model/hooks/use-credentials-register'
import AuthField from '@/features/authentication/ui/AuthField'

interface Props {
  onSuccess: (values: SignUpValues) => void
}

export default function SignUpDetailsStep({ onSuccess }: Props) {
  const t = useTranslations('Index.Auth')
  const messages = useAuthSchemaMessages()
  const schema = useMemo(() => createSignUpSchema(messages), [messages])

  const { register: submitRegister, isLoading } = useCredentialsRegister()
  const [formError, setFormError] = useState('')

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<SignUpValues>({
    resolver: zodResolver(schema),
    defaultValues: { name: '', email: '', password: '' }
  })

  const onSubmit = async (values: SignUpValues) => {
    setFormError('')
    const result = await submitRegister(values)
    if (!result.ok) {
      setFormError(result.message)
      return
    }
    onSuccess(values)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <AuthField
        id="name"
        label={t('name')}
        placeholder={t('name-placeholder')}
        autoComplete="name"
        error={errors.name?.message}
        {...register('name')}
      />
      <AuthField
        id="email"
        label={t('email')}
        type="email"
        placeholder="you@example.com"
        autoComplete="email"
        error={errors.email?.message}
        {...register('email')}
      />
      <AuthField
        id="password"
        label={t('password')}
        type="password"
        placeholder="••••••••"
        autoComplete="new-password"
        error={errors.password?.message}
        {...register('password')}
      />

      {formError && <p className="text-sm text-destructive">{formError}</p>}

      <Button type="submit" disabled={isLoading} className="w-full h-10 font-semibold tracking-wide">
        {isLoading ? t('loading') : t('create-account')}
      </Button>
    </form>
  )
}
