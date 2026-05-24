'use client'

import { useTranslations } from 'next-intl'
import VerifyCodeForm from '@/features/authentication/ui/VerifyCodeForm'

interface Props {
  email: string
  password: string
}

export default function SignUpVerifyStep({ email, password }: Props) {
  const t = useTranslations('Index.Auth')

  return (
    <div className="flex flex-col gap-6">
      <div className="text-center space-y-1">
        <h2 className="text-xl font-bold tracking-tight">{t('verify-title')}</h2>
        <p className="text-sm text-muted-foreground">{t('verify-description', { email })}</p>
      </div>
      <VerifyCodeForm email={email} password={password} />
    </div>
  )
}
