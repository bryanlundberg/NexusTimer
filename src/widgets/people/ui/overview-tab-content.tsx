import { motion } from 'motion/react'
import EmptyTabContent from '@/widgets/people/ui/empty-tab-content'
import { CategoryStatsCard } from '@/widgets/people/ui/category-stats-card'
import type { CategoryStats } from '@/entities/user-stats/model/types'

const STAGGER = { hidden: {}, show: { transition: { staggerChildren: 0.05 } } }

export default function OverviewTabContent({ categories }: { categories: CategoryStats[] }) {
  if (categories.length === 0) {
    return <EmptyTabContent />
  }

  return (
    <motion.div
      initial="hidden"
      animate="show"
      variants={STAGGER}
      className="flex flex-col border border-border/60 bg-card/40"
    >
      {categories.map((stats) => (
        <CategoryStatsCard key={stats.category} stats={stats} />
      ))}
    </motion.div>
  )
}
