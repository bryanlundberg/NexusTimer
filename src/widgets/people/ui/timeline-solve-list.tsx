import { motion } from 'motion/react'
import { useLocale } from 'next-intl'
import dayjs from '@/shared/lib/dayjs'
import { cn } from '@/shared/lib/utils'
import type { RecentSolve } from '@/entities/user-stats/model/types'
import { TimelineSolveRow } from '@/widgets/people/ui/timeline-solve-row'

interface TimelineSolveListProps {
  solves: RecentSolve[]
  totalSolves: number
  className?: string
}

interface SolveDay {
  key: string
  label: string
  entries: { solve: RecentSolve; solveNumber: number }[]
}

export function TimelineSolveList({ solves, totalSolves, className }: TimelineSolveListProps) {
  const locale = useLocale()
  const days = groupByDay(solves, totalSolves, locale)

  return (
    <motion.div
      initial="hidden"
      animate="show"
      variants={{ hidden: {}, show: { transition: { staggerChildren: 0.03 } } }}
      className={cn('border border-border/60 bg-card/40', className)}
    >
      {days.map((day) => (
        <section key={day.key} className="border-b border-border/60 last:border-b-0">
          <h3 className="border-b border-border/40 bg-muted/30 px-3 py-2 font-display text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
            {day.label}
          </h3>
          {day.entries.map(({ solve, solveNumber }) => (
            <TimelineSolveRow key={solve.id} solve={solve} solveNumber={solveNumber} />
          ))}
        </section>
      ))}
    </motion.div>
  )
}

function groupByDay(solves: RecentSolve[], totalSolves: number, locale: string): SolveDay[] {
  const today = dayjs().startOf('day')
  const relative = new Intl.RelativeTimeFormat(locale, { numeric: 'auto' })
  const days: SolveDay[] = []

  solves.forEach((solve, i) => {
    const date = dayjs(solve.startTime)
    const key = date.format('YYYY-MM-DD')
    let day = days[days.length - 1]
    if (!day || day.key !== key) {
      const diff = date.startOf('day').diff(today, 'day')
      const label = diff === 0 || diff === -1 ? relative.format(diff, 'day') : date.locale(locale).format('LL')
      day = { key, label, entries: [] }
      days.push(day)
    }
    day.entries.push({ solve, solveNumber: totalSolves - i })
  })

  return days
}
