'use client'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { UserDocument } from '@/entities/user/model/user'
import { Cube } from '@/entities/cube/model/types'
import { useMemo } from 'react'
import { cubeCollection } from '@/shared/const/cube-collection'
import formatTime from '@/shared/lib/formatTime'
import { sort } from 'fast-sort'
import { useLocale, useTranslations } from 'next-intl'
import dayjs from '@/shared/lib/dayjs'
import { ArrowUp } from 'lucide-react'
import { WcaBadge } from '@/shared/ui/wca-badge/WcaBadge'
import { CountryFlag } from '@/shared/ui/country-flag/CountryFlag'
import { getCountryName } from '@/shared/lib/getCountryName'
import { PresenceDot } from '@/features/presence/ui/PresenceDot'
import { usePresence, resolvePresenceDisplay } from '@/features/presence/model/usePresence'

interface Props {
  user: UserDocument
  cubes: Cube[]
  level: number
}

export function ProfileHeroBanner({ user, cubes, level }: Props) {
  const locale = useLocale()
  const t = useTranslations('Index.PeoplePage.hero')

  const pb3x3 = useMemo(() => {
    const solves = cubes
      .filter((c) => c.category === '3x3')
      .flatMap((c) => [
        ...c.solves.all.filter((s) => !s.isDeleted && !s.dnf),
        ...c.solves.session.filter((s) => !s.isDeleted && !s.dnf)
      ])

    if (solves.length === 0) return null

    const best = sort(solves).asc((s) => s.time)[0]
    const daysAgo = dayjs().diff(dayjs(best.endTime), 'day')
    return { time: best.time, endTime: best.endTime, daysAgo, isNew: daysAgo <= 30 }
  }, [cubes])

  const cubeImage = cubeCollection.find((c) => c.name === '3x3')?.src

  const memberSince = dayjs(user.createdAt).locale(locale).format('MMM YYYY')

  const presence = usePresence(user._id)

  return (
    <div className="w-full px-4 md:px-6 py-6 flex flex-col sm:flex-row items-start justify-between gap-6 border-b border-border/40 bg-muted/20">
      {/* Left: avatar + user info */}
      <div className="flex items-center gap-4 min-w-0">
        <div className="relative shrink-0">
          <Avatar className="size-16 sm:size-20 md:size-24 rounded-lg shadow-xl ring-2 ring-border/40">
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

        <div className="flex flex-col gap-1.5 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[10px] font-semibold tracking-widest text-muted-foreground uppercase">
              {t('cuber')}
            </span>
            {user.goal && (
              <Badge variant="destructive" className="text-[10px] font-bold uppercase px-1.5 py-0 h-4">
                {user.goal}
              </Badge>
            )}
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight leading-none flex items-baseline gap-2 min-w-0">
            <span className="min-w-0 truncate">{user.name}</span>
            {user.pronoun && (
              <span className="text-base font-normal text-muted-foreground shrink-0">{user.pronoun}</span>
            )}
            {user.wcaId && (
              <WcaBadge wcaId={user.wcaId} showCode className="text-base font-normal shrink-0" iconClassName="size-5" />
            )}
          </h1>
          <div className="flex items-center gap-1.5 text-sm text-muted-foreground flex-wrap">
            {user.bio && <span className="wrap-break-word">{user.bio}</span>}
            {user.bio && <span className="opacity-50">·</span>}
            {user.country && (
              <>
                <span className="flex items-center gap-1.5">
                  <CountryFlag code={user.country} className="shrink-0" />
                  {getCountryName(user.country, locale)}
                </span>
                <span className="opacity-50">·</span>
              </>
            )}
            <span>{t('member-since', { date: memberSince })}</span>
          </div>
        </div>
      </div>

      {/* Right: 3x3 PB + cube image — hidden on mobile */}
      {pb3x3 && (
        <div className="hidden sm:flex items-center gap-4 md:gap-6 sm:ml-auto shrink-0">
          <div className="flex flex-col items-start sm:items-end gap-0.5">
            <p className="text-[10px] font-semibold tracking-widest text-muted-foreground uppercase">
              {t('pb-label', { date: dayjs(pb3x3.endTime).locale(locale).format('MMM D, YYYY') })}
            </p>
            <div className="flex items-baseline gap-1">
              <span className="text-4xl sm:text-5xl md:text-6xl font-black tabular-nums leading-none">
                {formatTime(pb3x3.time)}
              </span>
              <span className="text-2xl sm:text-3xl font-light text-muted-foreground leading-none">s</span>
            </div>
            {pb3x3.isNew && (
              <div className="flex items-center gap-1 text-xs">
                <ArrowUp className="size-3 text-emerald-500" />
                <span className="font-semibold text-emerald-500">{t('new-pb')}</span>
                <span className="text-muted-foreground">{t('pb-broken', { days: pb3x3.daysAgo })}</span>
              </div>
            )}
          </div>
          {cubeImage && (
            <img
              src={'/utils/cubex.webp'}
              alt="3x3 cube"
              className="opacity-80 shrink-0 w-16 h-16 sm:w-20 sm:h-20 md:w-22.5 md:h-22.5"
            />
          )}
        </div>
      )}
    </div>
  )
}
