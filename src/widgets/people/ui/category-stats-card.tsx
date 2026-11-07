import * as React from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { useLocale, useTranslations } from 'next-intl'
import { ChevronDown } from 'lucide-react'
import formatTime from '@/shared/lib/formatTime'
import { CubeCategoryTile } from '@/shared/ui/cube-category-icon/CubeCategoryIcon'
import { CategoryBadge } from '@/shared/ui/category-badge/CategoryBadge'
import type { CategoryStats } from '@/entities/user-stats/model/types'
import type { CubeCategory } from '@/shared/const/cube-categories'
import { CategoryRecordDetails } from '@/widgets/people/ui/category-record-details'
import { CategoryCardStat } from '@/widgets/people/ui/category-card-stat'
import { RecordTimeValue } from '@/widgets/people/ui/record-time-value'

export function CategoryStatsCard({ stats }: { stats: CategoryStats }) {
  const { category, count, best, bestAo5 } = stats
  const locale = useLocale()
  const tSolveCard = useTranslations('Index.PeoplePage.solve-card')
  const tCubes = useTranslations('Index.PeoplePage.cubes-tab')
  const [isOpen, setIsOpen] = React.useState(false)

  return (
    <motion.div
      className="border border-border/60 bg-card/40"
      variants={{ hidden: { opacity: 0 }, show: { opacity: 1 } }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
    >
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-expanded={isOpen}
        className="flex w-full cursor-pointer flex-col gap-3 p-3 text-left transition-colors duration-150 hover:bg-muted/40"
      >
        <span className="flex w-full items-center gap-2.5">
          <CubeCategoryTile category={category} />
          <CategoryBadge category={category as CubeCategory} className="shrink-0" />
          <ChevronDown
            className={`ml-auto size-4 shrink-0 text-muted-foreground transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
          />
        </span>
        <span className="grid w-full grid-cols-3 gap-3">
          <CategoryCardStat label={tSolveCard('single')}>
            <RecordTimeValue size="lg" value={best ? formatTime(best.time) : '--'} />
          </CategoryCardStat>
          <CategoryCardStat label={tCubes('col-ao5')}>
            <RecordTimeValue size="lg" value={bestAo5 ? formatTime(bestAo5.time) : '--'} />
          </CategoryCardStat>
          <CategoryCardStat label={tCubes('col-solves')}>
            <span className="text-xl font-bold tabular-nums">{count.toLocaleString(locale)}</span>
          </CategoryCardStat>
        </span>
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="overflow-hidden"
          >
            <CategoryRecordDetails stats={stats} className="border-t border-border/40 p-3" />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
