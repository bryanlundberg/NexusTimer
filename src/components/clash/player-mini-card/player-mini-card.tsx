import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import Image from 'next/image'
import { CircleCheckIcon, ExternalLink } from 'lucide-react'
import { TimerStatus } from '@/enums/TimerStatus'
import { Button } from '@/components/ui/button'
import * as React from 'react'
import Link from 'next/link'

export interface PlayerMiniCardProps {
  name?: string
  avatarUrl?: string
  status?: TimerStatus
  id: string
}

export default function PlayerMiniCard({ name, avatarUrl, status, id }: PlayerMiniCardProps) {
  return (
    <div className={'flex flex-col items-center justify-center bg-card rounded-lg p-4 size-full'}>
      <div className={'relative'}>
        {avatarUrl && (
          <Avatar className={'w-full h-full'}>
            <AvatarImage src={avatarUrl} draggable={false} className={'object-cover'} />
            <AvatarFallback>{(name?.[0] || '?').toUpperCase()}</AvatarFallback>
          </Avatar>
        )}
        {status && (
          <>
            {status === TimerStatus.SOLVING && (
              <div className={'absolute inset-0 w-full h-full'}>
                <Image
                  src="/animated/source.gif"
                  alt="Solving"
                  width={64}
                  height={64}
                  className="w-full h-full object-cover rounded-lg"
                />
              </div>
            )}

            {status === TimerStatus.IDLE && (
              <div className={'absolute -bottom-3 -right-3'}>
                <CircleCheckIcon className={'text-green-500 text-xs'} />
              </div>
            )}
          </>
        )}
      </div>
      <p className={'text-center text-sm mt-1'}>{name}</p>
      <Link href={`/people/${id}`}>
        <Button size={'sm'} className={'mt-2 text-xs'}>
          View Profile <ExternalLink className="size-3.5" />
        </Button>
      </Link>
    </div>
  )
}
