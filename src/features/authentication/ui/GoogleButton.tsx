'use client'
import Image from 'next/image'
import { signIn, useSession } from 'next-auth/react'
import { useTranslations } from 'next-intl'

export default function GoogleButton() {
  const { data: session } = useSession()
  const t = useTranslations('Index.Auth')

  if (session) return null

  return (
    <button
      type="button"
      onClick={() => signIn('google')}
      aria-label={t('continue-google')}
      title={t('continue-google')}
      className="size-11 rounded-full border bg-background hover:bg-muted hover:scale-105 active:scale-95 transition flex items-center justify-center"
    >
      <Image src="/timer-logos/google.svg" alt="" width={20} height={20} />
    </button>
  )
}
