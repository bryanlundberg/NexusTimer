'use client'

import { useTranslations } from 'next-intl'
import GoogleButton from '@/features/authentication/ui/GoogleButton'
import AccountHeader from '@/features/account/ui/account-header'

export default function AccountNotAuth() {
  const t = useTranslations('Index')
  return (
    <>
      <div className="max-w-md mx-auto bg-background/90 backdrop-blur-lg pt-2">
        <AccountHeader back="/settings" label={t('SettingsPage.account')} />

        <div className="space-y-2">
          <GoogleButton />
          <p className="text-center text-xs">{t('SettingsPage.not-authenticated')}</p>
        </div>
      </div>
    </>
  )
}
