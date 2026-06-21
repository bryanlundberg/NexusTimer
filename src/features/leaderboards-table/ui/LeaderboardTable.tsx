'use client'

import LeaderboardTableRow from '@/features/leaderboards-table/ui/LeaderboardTableRow'
import { SolveServer } from '@/entities/solve/model/types'
import { useTranslations } from 'next-intl'
import { motion } from 'motion/react'

interface LeaderboardTableProps {
  solves: SolveServer[]
}

export const GRID = 'grid-cols-[2.5rem_minmax(10rem,1fr)_6rem_4rem_4rem_6rem_8rem]'

export default function LeaderboardTable({ solves }: LeaderboardTableProps) {
  const t = useTranslations('Index.LeaderboardsPage.table')

  const safeSolves = solves && solves.length > 0 ? solves : []

  return (
    <div className="overflow-x-auto max-w-4xl mx-auto">
      <div className="min-w-160">
        <div className={`grid ${GRID} items-center gap-x-4 px-3 py-2 border-b border-border/60`}>
          <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">#</span>
          <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">{t('user')}</span>
          <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
            {t('category')}
          </span>
          <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">{t('tps')}</span>
          <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">{t('moves')}</span>
          <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">{t('time')}</span>
          <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">{t('date')}</span>
        </div>

        <motion.div
          initial="hidden"
          animate="show"
          variants={{ hidden: {}, show: { transition: { staggerChildren: 0.03 } } }}
        >
          {safeSolves.map((solve, index) => (
            <LeaderboardTableRow key={solve._id} solve={solve} index={index} />
          ))}
        </motion.div>
      </div>
    </div>
  )
}
