'use client'

import { motion } from 'framer-motion'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { GlobeAmericasIcon } from '@heroicons/react/24/outline'
import { PlayIcon } from '@radix-ui/react-icons'
import { useRouter } from 'next/navigation'
import { Badge } from '@/components/ui/badge'
import formatTime from '@/shared/lib/formatTime'
import calcTurnsPerSecond from '@/shared/lib/statistics/calcTurnsPerSecond'
import moment from 'moment'
import useLeaderboardRow from '@/features/leaderboards-table/model/useLeaderboardRow'
import { SolveServer } from '@/entities/solve/model/types'
import { useLocale, useTranslations } from 'next-intl'
import { GRID } from '@/features/leaderboards-table/ui/LeaderboardTable'
import { cn } from '@/shared/lib/utils'

interface LeaderboardTableRowProps {
  solve: SolveServer
  index: number
}

function TimeDisplay({ value }: { value: string }) {
  const [main, decimal] = value.includes('.') ? value.split('.') : [value, null]
  return (
    <div className="flex items-baseline gap-0.5">
      <span className="text-sm font-bold tabular-nums">{main}</span>
      {decimal && <span className="text-xs text-muted-foreground tabular-nums">.{decimal}</span>}
    </div>
  )
}

export default function LeaderboardTableRow({ solve, index }: LeaderboardTableRowProps) {
  const t = useTranslations('Index.LeaderboardsPage.table')
  const router = useRouter()
  const locale = useLocale()
  const { openModal } = useLeaderboardRow(solve)

  if (!solve?.user) return null

  const rank = index + 1
  const tps = solve.solution ? calcTurnsPerSecond(solve.solution, solve.time) : null
  const hasReplay = Boolean(solve.replay?.moves?.length)

  return (
    <motion.div
      onClick={hasReplay ? openModal : undefined}
      variants={{ hidden: { opacity: 0 }, show: { opacity: 1 } }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
      className={cn(
        `grid ${GRID} items-center gap-x-4 px-3 py-2.5 border-b border-border/40 last:border-b-0 border-l-2 border-l-transparent transition-colors duration-150`,
        hasReplay && 'hover:bg-muted/20 hover:border-l-primary cursor-pointer'
      )}
    >
      <span className="text-xs font-mono text-muted-foreground tabular-nums text-right select-none">
        {String(rank).padStart(2, '0')}
      </span>

      <div className="min-w-0">
        <Tooltip>
          <TooltipTrigger asChild>
            <div
              className="flex flex-row items-center gap-2 min-w-0 hover:underline w-fit"
              onClick={(e) => {
                e.stopPropagation()
                router.push(`/people/${solve.user._id}`)
              }}
            >
              <Avatar className="size-7 shrink-0">
                <AvatarImage className="object-cover" src={solve.user.image} />
                <AvatarFallback className="text-[10px]">{solve.user.name.slice(0, 2)}</AvatarFallback>
              </Avatar>
              <span className="text-sm font-medium truncate">{solve.user.name}</span>
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <h2 className="scroll-m-20 text-center text-xl font-extrabold tracking-tight text-balance flex items-center justify-center gap-2">
              {solve.user.name}{' '}
              {solve.user?.pronoun && (
                <div className="flex items-center gap-1 text-sm text-muted-foreground font-normal">
                  <span>{solve.user?.pronoun}</span>
                </div>
              )}
            </h2>

            {solve.user?.timezone && (
              <div className="flex items-center gap-1">
                <GlobeAmericasIcon className="size-5" />
                {solve.user?.timezone}
                <span className="opacity-50">
                  (
                  {new Intl.DateTimeFormat(locale, {
                    timeZone: solve.user.timezone,
                    timeStyle: 'short'
                  }).format(new Date())}
                  )
                </span>
              </div>
            )}
            {solve.user?.goal && <Badge>{solve.user?.goal}</Badge>}
          </TooltipContent>
        </Tooltip>
      </div>

      <Badge variant="outline" className="font-mono text-[10px] px-1.5 py-0 h-4 w-fit shrink-0">
        {solve.puzzle}
      </Badge>

      <span className="text-[10px] font-mono text-muted-foreground/70 tabular-nums">
        {tps ? `${tps}` : t('not-available')}
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
        {moment(solve.createdAt).locale(locale).format('ll')}
      </span>
    </motion.div>
  )
}
