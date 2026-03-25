'use client'

import { useTranslations } from 'next-intl'
import GoogleButton from '@/features/authentication/ui/GoogleButton'
import DiscordButton from '@/features/authentication/ui/DiscordButton'
import { LogIn } from 'lucide-react'

export default function AccountNotAuth() {
  const t = useTranslations('Index')
  return (
    <div className="flex items-center justify-center min-h-[60dvh] px-4">
      <div className="w-full max-w-sm space-y-8 text-center">
        <div className="flex flex-col items-center gap-4">
          <div className="flex items-center justify-center size-16 rounded-2xl bg-primary/10 text-primary">
            <LogIn className="size-7" />
          </div>
          <div className="space-y-2">
            <h1 className="text-2xl font-bold tracking-tight">{t('SettingsPage.account')}</h1>
            <p className="text-sm text-muted-foreground leading-relaxed">{t('SettingsPage.not-authenticated')}</p>
          </div>
        </div>

        <div className="space-y-3">
          <GoogleButton />
          <DiscordButton />
        </div>
      </div>
    </div>
  )
}
