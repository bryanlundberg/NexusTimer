'use client'

import { useTranslations } from 'next-intl'
import GoogleButton from '@/features/authentication/ui/GoogleButton'
import AccountHeader from '@/features/account/ui/account-header'
import DiscordButton from '@/features/authentication/ui/DiscordButton';

export default function AccountNotAuth() {
  const t = useTranslations('Index')
  return (
    <>
      <div className="max-w-md mx-auto bg-background/90 backdrop-blur-lg pt-2">
        <AccountHeader back="/app" label={t('SettingsPage.account')} />

        <div className="space-y-2">
          <GoogleButton />
          <DiscordButton/>
          <p className="text-center text-xs">{t('SettingsPage.not-authenticated')}</p>
        </div>
      </div>
    </>
  )
}
