'use client'

import Link from 'next/link'
import { useTranslations } from 'next-intl'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import type { RelationshipResponse } from '@/entities/friendship/model/types'

export function MutualFriends({ mutual }: { mutual: RelationshipResponse['mutual'] }) {
  const t = useTranslations('Index.FriendsPage')
  if (mutual.count === 0) return null

  return (
    <div className="flex items-center gap-2 text-xs text-muted-foreground">
      <div className="flex -space-x-2">
        {mutual.users.map((user) => (
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
      <span>{t('mutual', { count: mutual.count })}</span>
    </div>
  )
}
