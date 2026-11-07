import * as React from 'react'
import { motion } from 'motion/react'
import { useLocale } from 'next-intl'
import dayjs from '@/shared/lib/dayjs'
import formatTime from '@/shared/lib/formatTime'
import { cn } from '@/shared/lib/utils'
import { CubeCategoryTile } from '@/shared/ui/cube-category-icon/CubeCategoryIcon'
import type { RecentSolve } from '@/entities/user-stats/model/types'
import { RecordTimeValue } from '@/widgets/people/ui/record-time-value'

interface TimelineSolveRowProps {
  solve: RecentSolve
  solveNumber: number
}

export function TimelineSolveRow({ solve, solveNumber }: TimelineSolveRowProps) {
  const locale = useLocale()
  const [isOpen, setIsOpen] = React.useState(false)

  return (
    <motion.button
      type="button"
      onClick={() => setIsOpen((prev) => !prev)}
      aria-expanded={isOpen}
      className="flex w-full cursor-pointer items-center gap-3 border-b border-border/40 px-3 py-2.5 text-left transition-colors duration-150 last:border-b-0 hover:bg-muted/40"
      variants={{ hidden: { opacity: 0 }, show: { opacity: 1 } }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
    >
      <CubeCategoryTile category={solve.category} className="self-start" />

      <span className="flex min-w-0 flex-1 flex-col gap-0.5">
        <span className="truncate text-sm font-medium text-foreground/80" title={solve.cubeName}>
          {solve.cubeName}
        </span>
        <span
          className={cn(
            'font-mono text-[10px] leading-relaxed text-muted-foreground/70',
            isOpen ? 'break-all' : 'truncate'
          )}
        >
          {solve.scramble}
        </span>
      </span>

      <span className="flex shrink-0 flex-col items-end gap-0.5 self-start">
        {solve.dnf ? (
          <span className="text-xl font-bold text-destructive">DNF</span>
        ) : (
          <span className="flex items-baseline gap-1">
            <RecordTimeValue size="lg" value={formatTime(solve.time)} />
            {solve.plus2 && <span className="text-[10px] font-bold text-destructive">+2</span>}
          </span>
        )}
        <span className="font-mono text-[10px] text-muted-foreground tabular-nums">
          #{solveNumber} · {dayjs(solve.startTime).locale(locale).format('HH:mm')}
        </span>
      </span>
    </motion.button>
  )
}
