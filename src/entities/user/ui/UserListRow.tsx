'use client'

import { Fragment, type ReactNode, type Ref } from 'react'
import Link from 'next/link'
import { useLocale, useTranslations } from 'next-intl'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import dayjs from '@/shared/lib/dayjs'
import { cn } from '@/shared/lib/utils'
import { Layers } from '@/shared/types/enums'
import { isCubingMethod } from '@/shared/const/cubing-methods'
import { FACE_COLORS, sortFaceColors } from '@/shared/const/face-colors'
import { PLATFORM_LABELS } from '@/shared/const/platform-brand'
import { getCountryName } from '@/shared/lib/getCountryName'
import { parseProfileLink } from '@/shared/lib/profile-links'
import { PlatformIcon } from '@/shared/ui/brand-icons/PlatformIcon'
import { CountryFlag } from '@/shared/ui/country-flag/CountryFlag'
import { FaceGlyph } from '@/shared/ui/face-glyph/FaceGlyph'
import { MethodGlyph } from '@/shared/ui/method-glyph/MethodGlyph'
import { WcaBadge } from '@/shared/ui/wca-badge/WcaBadge'
import { useMainColorsLabel, useMethodLabel } from '@/entities/user/model/useProfileTraitLabels'
import { PresenceDot } from '@/features/presence/ui/PresenceDot'
import { resolvePresenceDisplay, type PresenceState } from '@/features/presence/model/usePresence'

const MAX_LINK_ICONS = 4

export interface UserListRowUser {
  _id: string
  name: string
  image: string
  country?: string
  wcaId?: string
  pronoun?: string
  method?: string
  bio?: string
  mainColors?: Layers[]
  links?: string[]
  createdAt?: string | Date
}

interface Props {
  user: UserListRowUser
  presence?: PresenceState
  meta?: string | null
  actions?: ReactNode
  stackActions?: boolean
  avatarRef?: Ref<HTMLDivElement>
  rootRef?: Ref<HTMLDivElement>
}

export function UserListRow({ user, presence, meta, actions, stackActions = false, avatarRef, rootRef }: Props) {
  const tHero = useTranslations('Index.PeoplePage.hero')
  const locale = useLocale()
  const methodLabel = useMethodLabel()
  const colors = sortFaceColors(user.mainColors)
  const colorsLabel = useMainColorsLabel(colors)

  const method = isCubingMethod(user.method) ? user.method : null
  const links = (user.links ?? []).map(parseProfileLink).filter((link) => link !== null)

  const traits: { id: string; node: ReactNode }[] = []
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
  if (colors.length > 0) {
    traits.push({
      id: 'colors',
      node: (
        <span className="flex shrink-0 items-center gap-1" title={colorsLabel ?? undefined}>
          {colors.length === FACE_COLORS.length ? (
            <FaceGlyph color={colors} className="size-3.5" />
          ) : (
            colors.map((color) => <FaceGlyph key={color} color={color} className="size-3.5" />)
          )}
        </span>
      )
    })
  }

  const memberSince = user.createdAt
    ? tHero('member-since', { date: dayjs(user.createdAt).locale(locale).format('MMM YYYY') })
    : null
  const footer = [meta, memberSince].filter(Boolean).join(' · ')

  return (
    <div
      ref={rootRef}
      className={cn(
        'flex gap-3 px-3 py-3 border-b border-border/40 last:border-b-0 border-l-2 border-l-transparent',
        'hover:bg-muted/20 hover:border-l-primary transition-colors duration-150',
        stackActions ? 'flex-col sm:flex-row sm:items-center' : 'items-center'
      )}
    >
      <Link href={`/people/${user._id}`} className="flex items-center gap-3 min-w-0 flex-1">
        <div ref={avatarRef} className="relative shrink-0">
          <Avatar className="size-9 rounded-lg">
            <AvatarImage className="object-cover" src={user.image} alt={user.name} />
            <AvatarFallback className="rounded-lg text-xs font-bold">
              {user.name.substring(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          {presence && (
            <span className="absolute -bottom-0.5 -right-0.5 rounded-full bg-background p-px">
              <PresenceDot state={resolvePresenceDisplay(presence)} className="size-2" />
            </span>
          )}
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

          {(footer || links.length > 0) && (
            <span className="flex min-w-0 items-center gap-1.5 text-[11px] text-muted-foreground/80">
              {footer && <span className="truncate">{footer}</span>}
              {links.length > 0 && (
                <>
                  {footer && <span className="shrink-0 opacity-40">·</span>}
                  <span className="flex shrink-0 items-center gap-1">
                    {/* The whole row is already a link, so these stay glyphs instead of nested anchors */}
                    {links.slice(0, MAX_LINK_ICONS).map(({ href, host, platform, handle }) => (
                      <span
                        key={href}
                        className="inline-flex"
                        title={platform ? [PLATFORM_LABELS[platform], handle].filter(Boolean).join(' ') : host}
                      >
                        <PlatformIcon platform={platform} className="size-3.5" />
                      </span>
                    ))}
                    {links.length > MAX_LINK_ICONS && <span>+{links.length - MAX_LINK_ICONS}</span>}
                  </span>
                </>
              )}
            </span>
          )}
        </div>
      </Link>

      {actions && (
        <div className={cn('flex items-center gap-2', stackActions ? 'sm:shrink-0' : 'shrink-0')}>{actions}</div>
      )}
    </div>
  )
}
