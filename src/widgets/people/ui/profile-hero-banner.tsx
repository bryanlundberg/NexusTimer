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
import { parseProfileLink } from '@/shared/lib/profile-links'
import { PresenceIndicator } from '@/features/presence/ui/PresenceIndicator'
import { usePresence, resolvePresenceDisplay } from '@/features/presence/model/usePresence'
import { useSession } from '@/shared/model/useSession'
import { ProfileContactInfo } from '@/widgets/people/ui/profile-contact-info'

interface Props {
  user: UserDocument
  aside?: React.ReactNode
  children?: React.ReactNode
}

export function ProfileHeroBanner({ user, aside, children }: Props) {
  const locale = useLocale()
  const t = useTranslations('Index.PeoplePage.hero')

  const memberSince = dayjs(user.createdAt).locale(locale).format('MMM YYYY')

  const { status } = useSession()
  const isSignedIn = status === 'authenticated'
  const presence = usePresence(isSignedIn ? user._id : null)
  const hasContactInfo = (user.links ?? []).some((link) => parseProfileLink(link) !== null)

  return (
    <div className="w-full px-4 md:px-6 py-6 flex flex-col gap-6 border-b border-border/40">
      <div className="flex flex-row items-start justify-between gap-6">
        <div className="flex min-w-0 flex-1 flex-row items-start gap-4">
          <div className="relative shrink-0">
            <Avatar className="size-20 sm:size-28 md:size-32 rounded-full ring-2 ring-border/40">
              <AvatarImage className="object-cover" src={user.image} alt={user.name} />
              <AvatarFallback>{user.name.substring(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
            {isSignedIn && (
              <PresenceIndicator
                state={resolvePresenceDisplay(presence)}
                className="absolute -bottom-0.5 -right-0.5 rounded-full bg-background p-0.5"
                dotClassName="size-3"
              />
            )}
          </div>

          <div className="flex min-w-0 flex-1 flex-col items-start gap-1.5 text-left">
            {user.goal && (
              <div className="flex items-center gap-2 flex-wrap">
                <Badge variant="default" className="text-[10px] font-bold uppercase px-1.5 py-0 h-4">
                  {user.goal}
                </Badge>
              </div>
            )}
            <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-tight leading-none flex items-baseline gap-2 min-w-0 max-w-full">
              <span className="min-w-0 truncate">{user.name}</span>
              {user.pronoun && (
                <span className="text-base font-normal text-muted-foreground shrink-0">{user.pronoun}</span>
              )}
            </h1>
            {user.username && (
              <p className="max-w-full truncate text-sm font-medium text-muted-foreground">@{user.username}</p>
            )}
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
              {hasContactInfo && (
                <>
                  <span className="opacity-50">·</span>
                  <ProfileContactInfo name={user.name} links={user.links ?? []} />
                </>
              )}
            </div>
            <ProfileTraits method={user.method} mainColors={user.mainColors} />
            {user.bio && <p className="max-w-prose text-sm text-muted-foreground wrap-break-word">{user.bio}</p>}
            {children}
          </div>
        </div>

        {aside}
      </div>
    </div>
  )
}
