'use client'
import { Button } from '@/components/ui/button'
import Image from 'next/image'
import { signIn, useSession } from 'next-auth/react'
import { useTranslations } from 'next-intl'

export default function GoogleButton() {
  const { data: session } = useSession()
  const t = useTranslations('Index.Auth')
  return (
    <>
      {!session && (
        <>
          <Button
            variant={'outline'}
            className="flex gap-3 items-center w-full justify-start h-10 px-4 transition-all hover:bg-muted"
            onClick={() => signIn('google')}
          >
            <Image src={'/timer-logos/google.svg'} alt="google logo" width={24} height={24} />
            <span className={'font-medium'}>{t('continue-google')}</span>
          </Button>
        </>
      )}
    </>
  )
}
