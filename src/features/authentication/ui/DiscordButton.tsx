import { signIn, useSession } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import Image from 'next/image'

export default function DiscordButton() {
  const { data: session } = useSession()
  return (
    <>
      {!session && (
        <>
          <Button
            variant={'ghost'}
            className="flex gap-2 items-center w-full"
            onClick={() => signIn('discord', { redirectTo: '/app' })}
          >
            <Image src={'/timer-logos/discord.png'} alt="google logo" width={20} height={20} />
            <p className={'overflow-hidden text-ellipsis'}>Discord</p>
          </Button>
        </>
      )}
    </>
  )
}
