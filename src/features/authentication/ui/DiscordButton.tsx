'use client'

import Image from 'next/image'
import { useSession } from 'next-auth/react'
import { useTranslations } from 'next-intl'
import OAuthIconButton from '@/features/authentication/ui/OAuthIconButton'

export default function DiscordButton() {
  const { data: session } = useSession()
  const t = useTranslations('Index.Auth')

  if (session) return null

  return (
    <OAuthIconButton provider="discord" label={t('continue-discord')}>
      <Image src="/timer-logos/discord.png" alt="" width={22} height={22} />
    </OAuthIconButton>
  )
}
