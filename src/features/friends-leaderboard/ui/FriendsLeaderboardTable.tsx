'use client'

import type { FriendsLeaderboardRow as Row } from '@nexustimer/contracts'
import { motion } from 'motion/react'
import { useTranslations } from 'next-intl'
import FriendsLeaderboardRow from '@/features/friends-leaderboard/ui/FriendsLeaderboardRow'
import { FRIENDS_GRID } from '@/features/friends-leaderboard/ui/friends-grid'

const STAGGER_BUDGET = 0.5
const STAGGER_STEP = 0.03

export default function FriendsLeaderboardTable({ rows }: { rows: Row[] }) {
  const t = useTranslations('Index.LeaderboardsPage')
  const stagger = Math.min(STAGGER_STEP, STAGGER_BUDGET / Math.max(rows.length, 1))
  const headerCell = 'font-display text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground'

  return (
    <div className="overflow-x-auto border border-border/60 bg-card/40">
      <div className={`grid ${FRIENDS_GRID} items-center gap-x-4 border-b border-border/60 bg-muted/30 px-3 py-2`}>
        <span className={`${headerCell} text-right`}>#</span>
        <span className={headerCell}>{t('table.user')}</span>
        <span className={`${headerCell} hidden sm:block`}>{t('friends.solves')}</span>
        <span className={`${headerCell} justify-self-end sm:justify-self-auto`}>{t('table.time')}</span>
        <span className={`${headerCell} hidden sm:block`}>{t('table.date')}</span>
      </div>

      <motion.div
        initial="hidden"
        animate="show"
        variants={{ hidden: {}, show: { transition: { staggerChildren: stagger } } }}
      >
        {rows.map((row, index) => (
          <FriendsLeaderboardRow key={row.user._id} row={row} index={index} />
        ))}
      </motion.div>
    </div>
  )
}
