'use client'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { UserDocument } from '@/entities/user/model/user'
import { useLocale, useTranslations } from 'next-intl'
import dayjs from '@/shared/lib/dayjs'
import { WcaBadge } from '@/shared/ui/wca-badge/WcaBadge'
import { CountryFlag } from '@/shared/ui/country-flag/CountryFlag'
import { getCountryName } from '@/shared/lib/getCountryName'
import { ProfileTraits } from '@/entities/user/ui/ProfileTraits'
import { ProfileLinks } from '@/entities/user/ui/ProfileLinks'
import { PresenceDot } from '@/features/presence/ui/PresenceDot'
import { usePresence, resolvePresenceDisplay } from '@/features/presence/model/usePresence'

interface Props {
  user: UserDocument
  level: number
  actions?: React.ReactNode
  children?: React.ReactNode
}

export function ProfileHeroBanner({ user, level, actions, children }: Props) {
  const locale = useLocale()
  const t = useTranslations('Index.PeoplePage.hero')

  const memberSince = dayjs(user.createdAt).locale(locale).format('MMM YYYY')

  const presence = usePresence(user._id)

  return (
    <div className="w-full px-4 md:px-6 py-6 flex flex-col gap-6 border-b border-border/40">
      <div className="flex flex-col sm:flex-row items-start justify-between gap-6">
        {/* Left: avatar + user info */}
        <div className="flex flex-col items-start gap-4 min-w-0 w-full sm:w-auto sm:flex-row sm:items-center">
          <div className="relative shrink-0 self-center sm:self-auto">
            <Avatar className="size-28 md:size-32 rounded-full shadow-xl ring-2 ring-border/40">
              <AvatarImage className="object-cover" src={user.image} alt={user.name} />
              <AvatarFallback>{user.name.substring(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
            {level > 0 && (
              <span className="absolute -bottom-2 left-1 bg-destructive text-destructive-foreground text-[10px] font-bold px-1.5 py-0.5 rounded leading-none">
                LV.{level}
              </span>
            )}
            <span className="absolute -bottom-0.5 -right-0.5 rounded-full bg-background p-0.5">
              <PresenceDot state={resolvePresenceDisplay(presence)} className="size-3" />
            </span>
          </div>

          <div className="flex flex-col gap-1.5 min-w-0 w-full sm:w-auto">
            {user.goal && (
              <div className="flex items-center gap-2 flex-wrap">
                <Badge variant="default" className="badge-notch text-[10px] font-bold uppercase px-1.5 py-0 h-4">
                  {user.goal}
                </Badge>
              </div>
            )}
            <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-tight leading-none flex items-baseline gap-2 min-w-0">
              <span className="min-w-0 truncate">{user.name}</span>
              {user.pronoun && (
                <span className="text-base font-normal text-muted-foreground shrink-0">{user.pronoun}</span>
              )}
            </h1>
            <div className="flex items-center gap-1.5 text-sm text-muted-foreground flex-wrap">
              {user.country && (
                <>
                  <span className="flex items-center gap-1.5">
                    <CountryFlag code={user.country} className="shrink-0" />
                    {getCountryName(user.country, locale)}
                  </span>
                  <span className="opacity-50">·</span>
                </>
              )}
              {user.wcaId && (
                <>
                  <WcaBadge
                    wcaId={user.wcaId}
                    showCode
                    className="text-sm font-normal shrink-0"
                    iconClassName="size-4"
                  />
                  <span className="opacity-50">·</span>
                </>
              )}
              <span>{t('member-since', { date: memberSince })}</span>
            </div>
            <ProfileTraits method={user.method} mainColors={user.mainColors} />
            {user.bio && <p className="text-sm text-muted-foreground wrap-break-word">{user.bio}</p>}
            {children}
          </div>
        </div>

        <ProfileLinks links={user.links} className="shrink-0 sm:max-w-[40%] sm:justify-end" />
      </div>

      {actions}
    </div>
  )
}
