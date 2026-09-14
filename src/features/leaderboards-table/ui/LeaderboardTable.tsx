'use client'

import LeaderboardTableRow from '@/features/leaderboards-table/ui/LeaderboardTableRow'
import { SolveServer } from '@/entities/solve/model/types'
import { useTranslations } from 'next-intl'
import { motion } from 'motion/react'

interface LeaderboardTableProps {
  solves: SolveServer[]
}

export const GRID = 'grid-cols-[2.5rem_minmax(10rem,1fr)_6rem_4rem_4rem_6rem_8rem]'

const STAGGER_BUDGET = 0.5
const STAGGER_STEP = 0.03

export default function LeaderboardTable({ solves }: LeaderboardTableProps) {
  const t = useTranslations('Index.LeaderboardsPage.table')

  const safeSolves = solves && solves.length > 0 ? solves : []

  const stagger = Math.min(STAGGER_STEP, STAGGER_BUDGET / Math.max(safeSolves.length, 1))

  const headerCell = 'font-display text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground'

  return (
    <div className="overflow-x-auto max-w-4xl mx-auto border border-border/60 bg-card/40">
      <div className="min-w-160">
        <div className={`grid ${GRID} items-center gap-x-4 px-3 py-2 border-b border-border/60 bg-muted/30`}>
          <span className={`${headerCell} text-right`}>#</span>
          <span className={headerCell}>{t('user')}</span>
          <span className={headerCell}>{t('category')}</span>
          <span className={headerCell}>{t('tps')}</span>
          <span className={headerCell}>{t('moves')}</span>
          <span className={headerCell}>{t('time')}</span>
          <span className={headerCell}>{t('date')}</span>
        </div>

        <motion.div
          initial="hidden"
          animate="show"
          variants={{ hidden: {}, show: { transition: { staggerChildren: stagger } } }}
        >
          {safeSolves.map((solve, index) => (
            <LeaderboardTableRow key={solve._id} solve={solve} index={index} />
          ))}
        </motion.div>
      </div>
    </div>
  )
}
