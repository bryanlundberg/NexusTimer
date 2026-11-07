import * as React from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { useLocale } from 'next-intl'
import { ChevronDown } from 'lucide-react'
import formatTime from '@/shared/lib/formatTime'
import { CubeCategoryTile } from '@/shared/ui/cube-category-icon/CubeCategoryIcon'
import { CategoryBadge } from '@/shared/ui/category-badge/CategoryBadge'
import type { CategoryStats } from '@/entities/user-stats/model/types'
import { CubeCategory } from '@/shared/const/cube-categories'
import { GRID } from '@/widgets/people/ui/overview-tab-content'
import { CategoryRecordDetails } from '@/widgets/people/ui/category-record-details'
import { RecordTimeValue } from '@/shared/ui/record-time-value/RecordTimeValue'

interface PeopleOverviewRowProps {
  stats: CategoryStats
}

export default function PeopleOverviewRow({ stats }: PeopleOverviewRowProps) {
  const { category, count, best, bestAo5 } = stats
  const locale = useLocale()
  const [isOpen, setIsOpen] = React.useState(false)

  return (
    <div className="border-b border-border/40 last:border-b-0">
      <motion.div
        onClick={() => setIsOpen((prev) => !prev)}
        aria-expanded={isOpen}
        className={`grid ${GRID} items-center gap-x-4 px-3 py-3 cursor-pointer hover:bg-muted/40 transition-colors duration-150`}
        variants={{ hidden: { opacity: 0 }, show: { opacity: 1 } }}
        transition={{ duration: 0.25, ease: 'easeOut' }}
      >
        <div className="flex items-center gap-2.5 min-w-0">
          <CubeCategoryTile category={category} />
          <CategoryBadge category={category as CubeCategory} className="shrink-0" />
        </div>

        <RecordTimeValue value={best ? formatTime(best.time) : '--'} />

        <RecordTimeValue value={bestAo5 ? formatTime(bestAo5.time) : '--'} />

        <span className="text-sm font-bold tabular-nums">{count.toLocaleString(locale)}</span>

        <div className="flex items-center justify-center size-6 text-muted-foreground">
          <ChevronDown className={`size-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
        </div>
      </motion.div>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="overflow-hidden"
          >
            <CategoryRecordDetails stats={stats} className="px-3 pb-3" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
