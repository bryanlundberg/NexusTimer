'use client'

import Image from 'next/image'
import { useSession } from 'next-auth/react'
import { useTranslations } from 'next-intl'
import OAuthIconButton from '@/features/authentication/ui/OAuthIconButton'

export default function GoogleButton() {
  const { data: session } = useSession()
  const t = useTranslations('Index.Auth')

  if (session) return null

  return (
    <OAuthIconButton provider="google" label={t('continue-google')}>
      <Image src="/timer-logos/google.svg" alt="" width={20} height={20} />
    </OAuthIconButton>
  )
}
