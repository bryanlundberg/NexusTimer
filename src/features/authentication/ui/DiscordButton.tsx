import { signIn, useSession } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import Image from 'next/image'
import { useTranslations } from 'next-intl'

export default function DiscordButton() {
  const { data: session } = useSession()
  const t = useTranslations('Index.Auth')
  return (
    <>
      {!session && (
        <>
          <Button
            variant={'outline'}
            className="flex gap-3 items-center w-full justify-start h-10 px-4 transition-all hover:bg-muted"
            onClick={() => signIn('discord')}
          >
            <Image src={'/timer-logos/discord.png'} alt="discord logo" width={24} height={24} />
            <span className={'font-medium'}>{t('continue-discord')}</span>
          </Button>
        </>
      )}
    </>
  )
}
