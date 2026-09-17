'use client'

import { Fragment } from 'react'
import Link from 'next/link'
import { useLocale, useTranslations } from 'next-intl'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import dayjs from '@/shared/lib/dayjs'
import { cn } from '@/shared/lib/utils'
import { isCubingMethod } from '@/shared/const/cubing-methods'
import { WcaBadge } from '@/shared/ui/wca-badge/WcaBadge'
import { CountryFlag } from '@/shared/ui/country-flag/CountryFlag'
import { MethodGlyph } from '@/shared/ui/method-glyph/MethodGlyph'
import { getCountryName } from '@/shared/lib/getCountryName'
import { useMethodLabel } from '@/entities/user/model/useProfileTraitLabels'
import { PresenceDot } from '@/features/presence/ui/PresenceDot'
import { resolvePresenceDisplay, type PresenceState } from '@/features/presence/model/usePresence'
import { usePresenceLabel } from '@/features/presence/model/usePresenceLabel'
import type { FriendUser } from '@/entities/friendship/model/types'

interface Props {
  user: FriendUser
  presence?: PresenceState
  friendsSince?: string
  actions: React.ReactNode
  stackActions?: boolean
}

export function FriendRow({ user, presence, friendsSince, actions, stackActions = false }: Props) {
  const t = useTranslations('Index.FriendsPage')
  const locale = useLocale()
  const methodLabel = useMethodLabel()
  const presenceLabel = usePresenceLabel(presence)

  const method = isCubingMethod(user.method) ? user.method : null

  // Country, WCA and method share a line and are separated by dots, so they are collected first
  const traits: { id: string; node: React.ReactNode }[] = []
  if (user.country) {
    traits.push({
      id: 'country',
      node: (
        <span className="flex min-w-0 items-center gap-1">
          <CountryFlag code={user.country} className="shrink-0" />
          <span className="truncate">{getCountryName(user.country, locale)}</span>
        </span>
      )
    })
  }
  if (user.wcaId) {
    traits.push({
      id: 'wca',
      node: <WcaBadge wcaId={user.wcaId} showCode className="text-xs" iconClassName="size-3.5" />
    })
  }
  if (method) {
    traits.push({
      id: 'method',
      node: (
        <span className="flex shrink-0 items-center gap-1.5" title={methodLabel(method).steps}>
          <MethodGlyph method={method} className="h-2 w-5" />
          <span className="font-medium text-foreground/80">{methodLabel(method).name}</span>
        </span>
      )
    })
  }

  const since = friendsSince
    ? t('friends-since', { date: dayjs(friendsSince).locale(locale).format('MMM YYYY') })
    : null
  const footer = [presenceLabel, since].filter(Boolean).join(' · ')

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
        <div className="flex flex-col min-w-0 gap-0.5 leading-tight">
          <span className="flex min-w-0 items-baseline gap-1.5">
            <span className="font-bold text-sm truncate">{user.name}</span>
            {user.pronoun && <span className="shrink-0 text-[10px] text-muted-foreground">{user.pronoun}</span>}
          </span>

          {traits.length > 0 && (
            <span className="flex items-center gap-1.5 text-xs text-muted-foreground min-w-0">
              {traits.map(({ id, node }, index) => (
                <Fragment key={id}>
                  {index > 0 && <span className="shrink-0 opacity-40">·</span>}
                  {node}
                </Fragment>
              ))}
            </span>
          )}

          {user.bio && <span className="truncate text-xs text-muted-foreground/70">{user.bio}</span>}

          {footer && <span className="truncate text-[11px] text-muted-foreground/80">{footer}</span>}
        </div>
      </Link>
      <div className={cn('flex items-center gap-2', stackActions ? 'sm:shrink-0' : 'shrink-0')}>{actions}</div>
    </div>
  )
}
