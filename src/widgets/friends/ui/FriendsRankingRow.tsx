'use client'

import { useLocale, useTranslations } from 'next-intl'
import { Link } from '@/shared/config/i18n/navigation'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import dayjs from '@/shared/lib/dayjs'
import formatTime from '@/shared/lib/formatTime'
import { formatDurationClock } from '@/shared/lib/formatDuration'
import { cn } from '@/shared/lib/utils'
import { PODIUM_CHIP, PODIUM_COLOR } from '@/shared/const/podium'
import { TimeDisplay } from '@/features/leaderboards-table/ui/TimeDisplay'
import { isTimeMetric, type RankedFriend, type RankingMetric } from '@/features/friends/model/friends-ranking'

interface Props {
  item: RankedFriend
  metric: RankingMetric
}

export function FriendsRankingRow({ item: { entry, rank, value }, metric }: Props) {
  const t = useTranslations('Index.FriendsPage.ranking')
  const locale = useLocale()
  const { user, isSelf, updatedAt } = entry
  const podium = rank - 1

  const formatted =
    metric === 'time'
      ? formatDurationClock(value)
      : metric === 'streak'
        ? t('days', { count: value })
        : value.toLocaleString(locale)

  return (
    <div
      style={PODIUM_COLOR[podium] ? { borderLeftColor: PODIUM_COLOR[podium] } : undefined}
      className={cn(
        'flex items-center gap-3 px-3 py-2.5 border-b border-border/40 last:border-b-0 border-l-2 border-l-transparent transition-colors duration-150',
        isSelf ? 'bg-primary/5 border-l-primary' : 'hover:bg-muted/20'
      )}
    >
      {rank <= 3 ? (
        <span
          className={cn(
            'chip-notch chip-notch-sm flex size-6 shrink-0 items-center justify-center font-display text-[11px] font-bold select-none',
            PODIUM_CHIP[podium]
          )}
        >
          {rank}
        </span>
      ) : (
        <span className="w-6 shrink-0 text-center font-mono text-xs tabular-nums text-muted-foreground select-none">
          {String(rank).padStart(2, '0')}
        </span>
      )}

      <Link href={`/people/${user._id}`} className="flex min-w-0 flex-1 items-center gap-3">
        <Avatar className="size-9 shrink-0 rounded-lg">
          <AvatarImage className="object-cover" src={user.image} alt={user.name} />
          <AvatarFallback className="rounded-lg text-xs font-bold">
            {user.name.substring(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>

        <div className="flex min-w-0 flex-col gap-0.5 leading-tight">
          <span className="flex min-w-0 items-baseline gap-1.5">
            <span className="truncate text-sm font-bold">{user.name}</span>
            {isSelf && (
              <span className="shrink-0 text-[10px] font-semibold uppercase tracking-wider text-primary">
                {t('you')}
              </span>
            )}
          </span>
          <span
            className="truncate text-[11px] text-muted-foreground/80"
            title={dayjs(updatedAt).locale(locale).format('LLL')}
          >
            {t('updated', { time: dayjs(updatedAt).locale(locale).fromNow() })}
          </span>
        </div>
      </Link>

      <div className="shrink-0">
        {isTimeMetric(metric) ? (
          <TimeDisplay value={formatTime(value)} isRecord={rank === 1} />
        ) : (
          <span className={cn('text-sm font-bold tabular-nums', rank === 1 && 'text-amber-700 dark:text-amber-400')}>
            {formatted}
          </span>
        )}
      </div>
    </div>
  )
}
