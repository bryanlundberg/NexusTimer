'use client'

import Link from 'next/link'
import { useTranslations } from 'next-intl'
import { useValidateResetToken } from '@/features/authentication/model/hooks/use-validate-reset-token'
import ResetPasswordForm from '@/features/authentication/ui/ResetPasswordForm'

interface Props {
  oobCode: string | null
}

export default function ResetPasswordContent({ oobCode }: Props) {
  const t = useTranslations('Index.Auth')
  const state = useValidateResetToken(oobCode)

  if (state.status === 'loading') {
    return <p className="text-sm text-muted-foreground text-center">{t('loading')}</p>
  }

  if (state.status === 'invalid') {
    return (
      <div className="flex flex-col gap-3 text-center">
        <p className="text-sm text-destructive">{t('invalid-token')}</p>
        <Link href="/forgot-password" className="text-sm font-medium hover:underline">
          {t('forgot-password-submit')}
        </Link>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4">
      <p className="text-sm text-muted-foreground text-center">{t('reset-password-for', { email: state.email })}</p>
      <ResetPasswordForm oobCode={oobCode as string} />
    </div>
  )
}
