'use client'
import Image from 'next/image'
import { signIn, useSession } from 'next-auth/react'
import { useTranslations } from 'next-intl'

export default function DiscordButton() {
  const { data: session } = useSession()
  const t = useTranslations('Index.Auth')

  if (session) return null

  return (
    <button
      type="button"
      onClick={() => signIn('discord')}
      aria-label={t('continue-discord')}
      title={t('continue-discord')}
      className="size-11 rounded-full border bg-background hover:bg-muted hover:scale-105 active:scale-95 transition flex items-center justify-center"
    >
      <Image src="/timer-logos/discord.png" alt="" width={22} height={22} />
    </button>
  )
}
