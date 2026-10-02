'use client'

import Image from 'next/image'
import { useSession } from '@/shared/model/useSession'
import { useTranslations } from 'next-intl'
import OAuthIconButton from '@/features/authentication/ui/OAuthIconButton'
import { signInWithProvider } from '@/features/authentication/model/sign-in-social'

export default function DiscordButton() {
  const { data: session } = useSession()
  const t = useTranslations('Index.Auth')

  if (session?.user?.id) return null

  return (
    <OAuthIconButton label={t('continue-discord')} brand="#5865f2" onClick={() => signInWithProvider('discord')}>
      <Image src="/timer-logos/discord.png" alt="" width={22} height={22} />
    </OAuthIconButton>
  )
}
