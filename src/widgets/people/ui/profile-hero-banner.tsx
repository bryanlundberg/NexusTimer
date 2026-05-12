'use client'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { UserDocument } from '@/entities/user/model/user'
import { Cube } from '@/entities/cube/model/types'
import { useMemo } from 'react'
import { cubeCollection } from '@/shared/const/cube-collection'
import formatTime from '@/shared/lib/formatTime'
import { sort } from 'fast-sort'
import { useLocale } from 'next-intl'
import moment from 'moment'
import useAchievements from '@/entities/achievement/model/useAchievements'
import { ArrowUpIcon } from '@heroicons/react/24/solid'

interface Props {
  user: UserDocument
  cubes: Cube[]
}

export function ProfileHeroBanner({ user, cubes }: Props) {
  const locale = useLocale()

  const { ACHIEVEMENTS_CONFIG } = useAchievements()
  const level = useMemo(
    () => ACHIEVEMENTS_CONFIG.filter((a) => a.condition({ cubes, user })).length,
    [ACHIEVEMENTS_CONFIG, cubes, user]
  )

  const pb3x3 = useMemo(() => {
    const solves = cubes
      .filter((c) => c.category === '3x3')
      .flatMap((c) => [
        ...c.solves.all.filter((s) => !s.isDeleted && !s.dnf),
        ...c.solves.session.filter((s) => !s.isDeleted && !s.dnf)
      ])

    if (solves.length === 0) return null

    const best = sort(solves).asc((s) => s.time)[0]
    const daysAgo = moment().diff(moment(best.endTime), 'days')
    return { time: best.time, endTime: best.endTime, daysAgo, isNew: daysAgo <= 30 }
  }, [cubes])

  const cubeImage = cubeCollection.find((c) => c.name === '3x3')?.src

  const memberSince = moment(user.createdAt).locale(locale).format('MMM YYYY')

  const timezoneAbbr = user.timezone
    ? (new Intl.DateTimeFormat('en-US', { timeZone: user.timezone, timeZoneName: 'short' })
        .formatToParts(new Date())
        .find((p) => p.type === 'timeZoneName')?.value ?? null)
    : null

  return (
    <div className="w-full px-4 md:px-6 py-5 flex flex-col md:flex-row items-start justify-between gap-6 border-b border-border/40">
      {/* Left: avatar + user info */}
      <div className="flex items-center gap-4">
        <div className="relative shrink-0">
          <Avatar className="size-24 rounded-lg shadow-xl ring-2 ring-border/40">
            <AvatarImage className="object-cover" src={user.image} alt={user.name} />
            <AvatarFallback>{user.name.substring(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
          {level > 0 && (
            <span className="absolute -bottom-2 left-1 bg-destructive text-destructive-foreground text-[10px] font-bold px-1.5 py-0.5 rounded leading-none">
              LV.{level}
            </span>
          )}
        </div>

        <div className="flex flex-col gap-1.5">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-semibold tracking-widest text-muted-foreground uppercase">Cuber</span>
            {user.goal && (
              <Badge variant="destructive" className="text-[10px] font-bold uppercase px-1.5 py-0 h-4">
                {user.goal}
              </Badge>
            )}
          </div>
          <h1 className="text-3xl font-black tracking-tight leading-none flex items-baseline gap-2">
            {user.name}
            {user.pronoun && <span className="text-base font-normal text-muted-foreground">{user.pronoun}</span>}
          </h1>
          <div className="flex items-center gap-1.5 text-sm text-muted-foreground flex-wrap">
            {user.bio && <span>{user.bio}</span>}
            {user.bio && <span className="opacity-50">·</span>}
            <span>Member since {memberSince}</span>
            {timezoneAbbr && (
              <>
                <span className="opacity-50">·</span>
                <span className="text-xs uppercase">{timezoneAbbr}</span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Right: 3x3 PB + cube image */}
      {pb3x3 && (
        <div className="flex items-center gap-4 md:gap-6 md:ml-auto">
          <div className="flex flex-col items-end gap-0.5">
            <p className="text-[10px] font-semibold tracking-widest text-muted-foreground uppercase">
              3x3 Personal Best · {moment(pb3x3.endTime).locale(locale).format('MMMM D')}
            </p>
            <div className="flex items-baseline gap-1">
              <span className="text-6xl font-black tabular-nums leading-none">{formatTime(pb3x3.time)}</span>
              <span className="text-3xl font-light text-muted-foreground leading-none">s</span>
            </div>
            {pb3x3.isNew && (
              <div className="flex items-center gap-1 text-xs">
                <ArrowUpIcon className="size-3 text-emerald-500" />
                <span className="font-semibold text-emerald-500">NEW PB</span>
                <span className="text-muted-foreground">
                  broken {pb3x3.daysAgo === 0 ? 'today' : `${pb3x3.daysAgo} day${pb3x3.daysAgo !== 1 ? 's' : ''} ago`}
                </span>
              </div>
            )}
          </div>
          {cubeImage && <img src={cubeImage} alt="3x3 cube" width={90} height={90} className="opacity-90 shrink-0" />}
        </div>
      )}
    </div>
  )
}
