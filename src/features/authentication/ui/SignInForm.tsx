'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useTranslations } from 'next-intl'
import { Button } from '@/components/ui/button'
import { createSignInSchema, type SignInValues } from '@/features/authentication/model/schemas'
import { useAuthSchemaMessages } from '@/features/authentication/model/use-auth-schema-messages'
import { useCredentialsLogin } from '@/features/authentication/model/hooks/use-credentials-login'
import AuthField from '@/features/authentication/ui/AuthField'

export default function SignInForm() {
  const router = useRouter()
  const t = useTranslations('Index.Auth')
  const messages = useAuthSchemaMessages()
  const schema = useMemo(() => createSignInSchema(messages), [messages])

  const { login, isLoading } = useCredentialsLogin()
  const [formError, setFormError] = useState('')

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<SignInValues>({
    resolver: zodResolver(schema),
    defaultValues: { email: '', password: '' }
  })

  const onSubmit = async (values: SignInValues) => {
    setFormError('')
    const result = await login(values)
    if (!result.ok) {
      setFormError(result.message)
      return
    }
    router.push('/app')
    router.refresh()
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
      <AuthField
        id="password"
        label={t('password')}
        type="password"
        autoComplete="current-password"
        placeholder="••••••••"
        error={errors.password?.message}
        {...register('password')}
      />

      <Link
        href="/forgot-password"
        className="self-end text-xs text-muted-foreground hover:text-foreground hover:underline"
      >
        {t('forgot-password')}
      </Link>

      {formError && <p className="text-sm text-destructive">{formError}</p>}

      <Button type="submit" disabled={isLoading} className="w-full h-10 font-semibold tracking-wide">
        {isLoading ? t('loading') : t('sign-in')}
      </Button>
    </form>
  )
}
