'use client'

import Image from 'next/image'
import { useSession } from '@/shared/model/useSession'
import { useTranslations } from 'next-intl'
import OAuthIconButton from '@/features/authentication/ui/OAuthIconButton'
import { signInWithProvider } from '@/features/authentication/model/sign-in-social'

export default function GoogleButton() {
  const { data: session } = useSession()
  const t = useTranslations('Index.Auth')

  if (session?.user?.id) return null

  return (
    <OAuthIconButton label={t('continue-google')} brand="#4285f4" onClick={() => signInWithProvider('google')}>
      <Image src="/timer-logos/google.svg" alt="" width={20} height={20} />
    </OAuthIconButton>
  )
}
