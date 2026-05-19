'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useTranslations } from 'next-intl'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { signUpSchema, type SignUpValues } from '@/features/authentication/model/schemas'
import { useCredentialsRegister } from '@/features/authentication/model/use-credentials-auth'
import VerifyCodeForm from '@/features/authentication/ui/VerifyCodeForm'

export default function SignUpForm() {
  const [pending, setPending] = useState<SignUpValues | null>(null)

  return pending ? <VerifyStep pending={pending} /> : <DetailsStep onSuccess={setPending} />
}

function DetailsStep({ onSuccess }: { onSuccess: (values: SignUpValues) => void }) {
  const t = useTranslations('Index.Auth')
  const { register: submitRegister, isLoading } = useCredentialsRegister()
  const [formError, setFormError] = useState('')

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<SignUpValues>({
    resolver: zodResolver(signUpSchema),
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
      <Field
        id="name"
        label={t('name')}
        placeholder={t('name-placeholder')}
        autoComplete="name"
        error={errors.name?.message}
        {...register('name')}
      />
      <Field
        id="email"
        label={t('email')}
        type="email"
        placeholder="you@example.com"
        autoComplete="email"
        error={errors.email?.message}
        {...register('email')}
      />
      <Field
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

function VerifyStep({ pending }: { pending: SignUpValues }) {
  const t = useTranslations('Index.Auth')
  return (
    <div className="flex flex-col gap-6">
      <div className="text-center space-y-1">
        <h2 className="text-xl font-bold tracking-tight">{t('verify-title')}</h2>
        <p className="text-sm text-muted-foreground">{t('verify-description', { email: pending.email })}</p>
      </div>
      <VerifyCodeForm email={pending.email} password={pending.password} />
    </div>
  )
}

type FieldProps = React.ComponentProps<typeof Input> & { label: string; error?: string }

function Field({ label, error, id, ...props }: FieldProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <Label htmlFor={id}>{label}</Label>
      <Input id={id} aria-invalid={!!error} {...props} />
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  )
}
