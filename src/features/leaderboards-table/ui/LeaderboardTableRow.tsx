'use client'

import { motion } from 'motion/react'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { CategoryBadge } from '@/shared/ui/category-badge/CategoryBadge'
import { PlayIcon } from '@radix-ui/react-icons'
import formatTime from '@/shared/lib/formatTime'
import { formatTps } from '@/shared/lib/formatTps'
import dayjs from '@/shared/lib/dayjs'
import useLeaderboardRow from '@/features/leaderboards-table/model/useLeaderboardRow'
import { useSolveAnalysis } from '@/features/leaderboards-table/model/useSolveAnalysis'
import { TimeDisplay } from '@/features/leaderboards-table/ui/TimeDisplay'
import { UserCell } from '@/features/leaderboards-table/ui/UserCell'
import { GRID } from '@/features/leaderboards-table/ui/LeaderboardTable'
import { SolveServer } from '@/entities/solve/model/types'
import { useLocale, useTranslations } from 'next-intl'
import { cn } from '@/shared/lib/utils'
import { PODIUM_CHIP, PODIUM_COLOR } from '@/shared/const/podium'

interface LeaderboardTableRowProps {
  solve: SolveServer
  index: number
}

export default function LeaderboardTableRow({ solve, index }: LeaderboardTableRowProps) {
  const t = useTranslations('Index.LeaderboardsPage.table')
  const locale = useLocale()
  const { openModal } = useLeaderboardRow(solve)
  const analysis = useSolveAnalysis(solve)

  if (!solve?.user) return null

  const rank = index + 1
  const podiumColor = PODIUM_COLOR[index]
  const hasReplay = Boolean(solve.replay?.moves?.length)
  const tps = analysis?.tps != null ? formatTps(analysis.tps) : null
  const moveCount = analysis ? analysis.moves.length : null

  return (
    <motion.div
      onClick={hasReplay ? openModal : undefined}
      variants={{ hidden: { opacity: 0 }, show: { opacity: 1 } }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
      style={podiumColor ? { borderLeftColor: podiumColor } : undefined}
      className={cn(
        `grid ${GRID} items-center gap-x-4 px-3 py-2.5 border-b border-border/40 last:border-b-0 border-l-2 border-l-transparent transition-colors duration-150`,
        rank === 1 && 'bg-amber-500/[0.04]',
        hasReplay && 'hover:bg-muted/20 cursor-pointer',
        hasReplay && rank > 3 && 'hover:border-l-primary'
      )}
    >
      {rank <= 3 ? (
        <span
          className={cn(
            'chip-notch chip-notch-sm flex size-6 items-center justify-center justify-self-end font-display text-[11px] font-bold select-none',
            PODIUM_CHIP[index]
          )}
        >
          {rank}
        </span>
      ) : (
        <span className="font-mono text-xs tabular-nums text-right text-muted-foreground select-none">
          {String(rank).padStart(2, '0')}
        </span>
      )}

      <div className="min-w-0">
        <UserCell user={solve.user} />
      </div>

      <CategoryBadge category={solve.puzzle} />

      <span className="text-[10px] font-mono text-muted-foreground/70 tabular-nums">{tps ?? t('not-available')}</span>

      <span className="text-[10px] font-mono text-muted-foreground/70 tabular-nums">
        {moveCount ?? t('not-available')}
      </span>

      <div className="flex items-center gap-1.5 min-w-0">
        <TimeDisplay value={formatTime(solve.time)} isRecord={rank === 1} />
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
