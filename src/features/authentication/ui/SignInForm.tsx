'use client'

import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useTranslations } from 'next-intl'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { signInSchema, type SignInValues } from '@/features/authentication/model/schemas'
import { useCredentialsLogin } from '@/features/authentication/model/use-credentials-auth'
import { useState } from 'react'

export default function SignInForm() {
  const router = useRouter()
  const t = useTranslations('Index.Auth')
  const { login, isLoading } = useCredentialsLogin()
  const [formError, setFormError] = useState('')

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<SignInValues>({
    resolver: zodResolver(signInSchema),
    defaultValues: { email: '', password: '' }
  })

  const onSubmit = async (values: SignInValues) => {
    setFormError('')
    const result = await login(values)
    if (!result.ok) {
      setFormError(result.message)
      return
    }
    router.push('/')
    router.refresh()
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="email">{t('email')}</Label>
        <Input id="email" type="email" autoComplete="email" placeholder="you@example.com" {...register('email')} />
        {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="password">{t('password')}</Label>
        <Input
          id="password"
          type="password"
          autoComplete="current-password"
          placeholder="••••••••"
          {...register('password')}
        />
        {errors.password && <p className="text-xs text-destructive">{errors.password.message}</p>}
      </div>

      {formError && <p className="text-sm text-destructive">{formError}</p>}

      <Button type="submit" disabled={isLoading} className="w-full h-10 font-semibold tracking-wide">
        {isLoading ? t('loading') : t('sign-in')}
      </Button>
    </form>
  )
}
