'use client'

import { motion } from 'motion/react'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { CategoryBadge } from '@/shared/ui/category-badge/CategoryBadge'
import { PlayIcon } from '@radix-ui/react-icons'
import formatTime from '@/shared/lib/formatTime'
import { formatTps } from '@/shared/lib/formatTps'
import { tryAnalyzeSolution } from '@/shared/lib/tryAnalyzeSolution'
import dayjs from '@/shared/lib/dayjs'
import useLeaderboardRow from '@/features/leaderboards-table/model/useLeaderboardRow'
import { TimeDisplay } from '@/features/leaderboards-table/ui/TimeDisplay'
import { UserCell } from '@/features/leaderboards-table/ui/UserCell'
import { GRID } from '@/features/leaderboards-table/ui/LeaderboardTable'
import { SolveServer } from '@/entities/solve/model/types'
import type { ReplayMove } from '@/entities/replay/model/types'
import { useLocale, useTranslations } from 'next-intl'
import { cn } from '@/shared/lib/utils'

interface LeaderboardTableRowProps {
  solve: SolveServer
  index: number
}

export default function LeaderboardTableRow({ solve, index }: LeaderboardTableRowProps) {
  const t = useTranslations('Index.LeaderboardsPage.table')
  const locale = useLocale()
  const { openModal } = useLeaderboardRow(solve)

  if (!solve?.user) return null

  const rank = index + 1
  const rankClass =
    rank === 1
      ? 'text-amber-400'
      : rank === 2
        ? 'text-zinc-300'
        : rank === 3
          ? 'text-amber-600'
          : 'text-muted-foreground'
  const rankBorderClass =
    rank === 1
      ? 'border-l-amber-400/80'
      : rank === 2
        ? 'border-l-zinc-300/80'
        : rank === 3
          ? 'border-l-amber-600/80'
          : 'border-l-transparent'
  const hasReplay = Boolean(solve.replay?.moves?.length)
  const analysis = hasReplay ? tryAnalyzeSolution(solve.replay!.moves as ReplayMove[]) : null
  const tps = analysis?.tps != null ? formatTps(analysis.tps) : null
  const moveCount = analysis ? (analysis.moves as ReplayMove[]).length : null

  return (
    <motion.div
      onClick={hasReplay ? openModal : undefined}
      variants={{ hidden: { opacity: 0 }, show: { opacity: 1 } }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
      className={cn(
        `grid ${GRID} items-center gap-x-4 px-3 py-2.5 border-b border-border/40 last:border-b-0 border-l-2 transition-colors duration-150`,
        rankBorderClass,
        hasReplay && 'hover:bg-muted/20 cursor-pointer',
        hasReplay && rank > 3 && 'hover:border-l-primary'
      )}
    >
      <span
        className={cn(
          'font-mono tabular-nums text-right select-none',
          rankClass,
          rank <= 3 ? 'text-sm font-bold' : 'text-xs'
        )}
      >
        {String(rank).padStart(2, '0')}
      </span>

      <div className="min-w-0">
        <UserCell user={solve.user} />
      </div>

      <CategoryBadge category={solve.puzzle} className="badge-notch text-[10px] px-1.5 py-0 h-4" />

      <span className="text-[10px] font-mono text-muted-foreground/70 tabular-nums">{tps ?? t('not-available')}</span>

      <span className="text-[10px] font-mono text-muted-foreground/70 tabular-nums">
        {moveCount ?? t('not-available')}
      </span>

      <div className="flex items-center gap-1.5 min-w-0">
        <TimeDisplay value={formatTime(solve.time)} />
        {hasReplay && (
          <Tooltip>
            <TooltipTrigger asChild>
              <span className="inline-flex shrink-0 text-primary">
                <PlayIcon className="size-3.5" />
              </span>
            </TooltipTrigger>
            <TooltipContent>{t('replay-available')}</TooltipContent>
          </Tooltip>
        )}
      </div>

      <span className="text-xs text-muted-foreground tabular-nums">
        {dayjs(solve.createdAt).locale(locale).format('ll')}
      </span>
    </motion.div>
  )
}
