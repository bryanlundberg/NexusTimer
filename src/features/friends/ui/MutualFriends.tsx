'use client'

import type { ReactNode } from 'react'
import { Link } from '@/shared/config/i18n/navigation'
import { useTranslations } from 'next-intl'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import type { FriendUser, RelationshipResponse } from '@/entities/friendship/model/types'

function shortName(name: string) {
  return name.trim().split(/\s+/).slice(0, 2).join(' ')
}

const MAX_NAMED = 2

function namedCountFor(total: number) {
  if (total === 3) return 1
  return Math.min(total, MAX_NAMED)
}

export function MutualFriends({ mutual }: { mutual: RelationshipResponse['mutual'] }) {
  const t = useTranslations('Index.FriendsPage')
  if (mutual.count === 0) return null

  const named = mutual.users.slice(0, namedCountFor(mutual.count))
  const rest = mutual.count - named.length
  const nameLink = (user: FriendUser) => (chunks: ReactNode) => (
    <Link href={`/people/${user._id}`} className="font-medium text-primary hover:underline">
      {chunks}
    </Link>
  )

  let text: ReactNode
  if (named.length !== namedCountFor(mutual.count)) {
    text = t('mutual', { count: mutual.count })
  } else if (named.length === 1) {
    const args = { firstName: shortName(named[0].name), first: nameLink(named[0]) }
    text =
      rest === 0
        ? t.rich('mutual-one', { name: args.firstName, accent: args.first })
        : t.rich('mutual-one-rest', { ...args, count: rest })
  } else {
    const args = {
      firstName: shortName(named[0].name),
      secondName: shortName(named[1].name),
      first: nameLink(named[0]),
      second: nameLink(named[1])
    }
    text = rest === 0 ? t.rich('mutual-two', args) : t.rich('mutual-two-rest', { ...args, count: rest })
  }

  return (
    <div className="flex items-center gap-2 text-xs text-muted-foreground">
      <div className="flex -space-x-2">
        {named.map((user) => (
          <Link key={user._id} href={`/people/${user._id}`} title={user.name}>
            <Avatar className="size-5 rounded-full ring-2 ring-background">
              <AvatarImage className="object-cover" src={user.image} alt={user.name} />
              <AvatarFallback className="text-[8px] font-bold">
                {user.name.substring(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </Link>
        ))}
      </div>
      <span>{text}</span>
    </div>
  )
}
