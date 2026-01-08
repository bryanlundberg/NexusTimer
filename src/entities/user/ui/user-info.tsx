import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { GlobeAmericasIcon } from '@heroicons/react/24/outline'
import { Badge } from '@/components/ui/badge'
import * as React from 'react'
import { UserDocument } from '@/entities/user/model/user'
import { useSession } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'

export default function UserInfo({ user }: { user: UserDocument }) {
  const { data: session } = useSession()
  const isCurrentUser = session?.user?.id === user._id
  const router = useRouter()
  const t = useTranslations('Index.PeoplePage')

  return (
    <div className="flex flex-col gap-2 p-4 md:sticky md:top-4 h-fit w-full max-w-xs">
      <div className="relative">
        <Avatar className="size-60 mb-2 shadow-lg mx-auto">
          <AvatarImage className={'object-cover'} src={user.image} alt={user.name} />
          <AvatarFallback>{user.name.substring(0, 2).toUpperCase()}</AvatarFallback>
        </Avatar>
      </div>
      <h2 className="scroll-m-20 text-center text-xl font-extrabold tracking-tight text-balance flex items-center justify-center gap-2">
        {user.name}{' '}
        {user?.pronoun && (
          <div className="flex items-center gap-1 text-sm text-muted-foreground font-normal">
            <span>{user?.pronoun}</span>
          </div>
        )}
      </h2>

      {user?.timezone && (
        <div className={'flex items-center gap-1'}>
          <GlobeAmericasIcon className={'size-5'} />
          {user?.timezone}
          <span className={'opacity-50'}>
            (
            {new Intl.DateTimeFormat('en-US', {
              timeZone: user.timezone,
              timeStyle: 'short'
            }).format(new Date())}
            )
          </span>
        </div>
      )}
      {user?.goal && <Badge>{user?.goal}</Badge>}

      {user?.bio && (
        <div className="w-full mt-2 text-sm">
          <p className="text-muted-foreground">{user?.bio}</p>
        </div>
      )}

      {isCurrentUser && (
        <Button variant="secondary" onClick={() => router.push('/account')}>
          {t('edit-profile')}
        </Button>
      )}
    </div>
  )
}
