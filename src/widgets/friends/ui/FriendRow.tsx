'use client'

import Link from 'next/link'
import { useLocale } from 'next-intl'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { cn } from '@/shared/lib/utils'
import { WcaBadge } from '@/shared/ui/wca-badge/WcaBadge'
import { CountryFlag } from '@/shared/ui/country-flag/CountryFlag'
import { getCountryName } from '@/shared/lib/getCountryName'
import { PresenceDot } from '@/features/presence/ui/PresenceDot'
import { resolvePresenceDisplay, type PresenceState } from '@/features/presence/model/usePresence'
import type { FriendUser } from '@/entities/friendship/model/types'

interface Props {
  user: FriendUser
  presence?: PresenceState
  actions: React.ReactNode
  stackActions?: boolean
}

export function FriendRow({ user, presence, actions, stackActions = false }: Props) {
  const locale = useLocale()

  return (
    <div
      className={cn(
        'flex gap-3 px-3 py-3 border-b border-border/40 last:border-b-0 hover:bg-muted/20 transition-colors duration-150',
        stackActions ? 'flex-col sm:flex-row sm:items-center' : 'items-center'
      )}
    >
      <Link href={`/people/${user._id}`} className="flex items-center gap-3 min-w-0 flex-1">
        <div className="relative shrink-0">
          <Avatar className="size-9 rounded-lg">
            <AvatarImage className="object-cover" src={user.image} alt={user.name} />
            <AvatarFallback className="rounded-lg text-xs font-bold">
              {user.name.substring(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <span className="absolute -bottom-0.5 -right-0.5 rounded-full bg-background p-px">
            <PresenceDot state={resolvePresenceDisplay(presence)} className="size-2" />
          </span>
        </div>
        <div className="flex flex-col min-w-0">
          <span className="font-bold text-sm truncate">{user.name}</span>
          <span className="flex items-center gap-1.5 text-xs text-muted-foreground min-w-0">
            {user.country && (
              <span className="flex items-center gap-1 min-w-0">
                <CountryFlag code={user.country} className="shrink-0" />
                <span className="truncate">{getCountryName(user.country, locale)}</span>
              </span>
            )}
            {user.wcaId && <WcaBadge wcaId={user.wcaId} showCode className="text-xs" iconClassName="size-3.5" />}
          </span>
        </div>
      </Link>
      <div className={cn('flex items-center gap-2', stackActions ? 'sm:shrink-0' : 'shrink-0')}>{actions}</div>
    </div>
  )
}
