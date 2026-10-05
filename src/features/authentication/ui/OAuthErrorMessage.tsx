'use client'

import { useSearchParams } from 'next/navigation'
import { useTranslations } from 'next-intl'

export default function OAuthErrorMessage() {
  const t = useTranslations('Index.Auth')
  const error = useSearchParams().get('error')
  if (!error) return null

  return (
    <p role="alert" className="text-sm text-destructive">
      {t(error === 'account_not_linked' ? 'oauth-account-not-linked' : 'oauth-error')}
    </p>
  )
}
