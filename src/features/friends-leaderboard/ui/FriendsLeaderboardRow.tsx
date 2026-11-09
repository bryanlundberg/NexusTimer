'use client'

import type { FriendsLeaderboardRow as Row } from '@nexustimer/contracts'
import { motion } from 'motion/react'
import { useLocale, useTranslations } from 'next-intl'
import formatTime from '@/shared/lib/formatTime'
import dayjs from '@/shared/lib/dayjs'
import { cn } from '@/shared/lib/utils'
import { PODIUM_CHIP } from '@/shared/const/podium'
import { TimeDisplay } from '@/features/leaderboards-table/ui/TimeDisplay'
import { UserCell } from '@/features/leaderboards-table/ui/UserCell'
import { FRIENDS_GRID } from '@/features/friends-leaderboard/ui/friends-grid'

interface FriendsLeaderboardRowProps {
  row: Row
  index: number
}

export default function FriendsLeaderboardRow({ row, index }: FriendsLeaderboardRowProps) {
  const t = useTranslations('Index.LeaderboardsPage.friends')
  const locale = useLocale()
  const rank = index + 1
  const date = row.achievedAt ? dayjs(row.achievedAt).locale(locale).format('ll') : null

  return (
    <motion.div
      variants={{ hidden: { opacity: 0 }, show: { opacity: 1 } }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
      className={cn(
        `grid ${FRIENDS_GRID} items-center gap-x-4 border-b border-border/40 px-3 py-2.5 last:border-b-0`,
        row.isSelf && 'bg-primary/10 shadow-[inset_2px_0_0_var(--primary)]'
      )}
    >
      {rank <= 3 ? (
        <span
          className={cn(
            'flex size-6 items-center justify-center justify-self-end font-display text-[11px] font-bold select-none',
            PODIUM_CHIP[index]
          )}
        >
          {rank}
        </span>
      ) : (
        <span className="text-right font-mono text-xs tabular-nums text-muted-foreground select-none">
          {String(rank).padStart(2, '0')}
        </span>
      )}

      <div className="flex min-w-0 flex-col gap-0.5">
        <UserCell user={row.user} />
        <span className="truncate pl-9 text-[11px] tabular-nums text-muted-foreground sm:hidden">
          {[date, t('solves-count', { count: row.count })].filter(Boolean).join(' · ')}
        </span>
      </div>

      <span className="hidden font-mono text-[10px] tabular-nums text-muted-foreground/70 sm:block">{row.count}</span>

      <div className="justify-self-end sm:justify-self-auto">
        <TimeDisplay value={formatTime(row.time)} isRecord={rank === 1} />
      </div>

      <span className="hidden text-xs tabular-nums text-muted-foreground sm:block">{date ?? ''}</span>
    </motion.div>
  )
}
