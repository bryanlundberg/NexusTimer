import * as React from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { useLocale, useTranslations } from 'next-intl'
import { ChevronDown } from 'lucide-react'
import dayjs from '@/shared/lib/dayjs'
import formatTime from '@/shared/lib/formatTime'
import { cn } from '@/shared/lib/utils'
import { CubeCategoryTile } from '@/shared/ui/cube-category-icon/CubeCategoryIcon'
import { CategoryBadge } from '@/shared/ui/category-badge/CategoryBadge'
import type { CategoryStats } from '@/entities/user-stats/model/types'
import type { CubeCategory } from '@/shared/const/cube-categories'
import { CategoryRecordDetails } from '@/widgets/people/ui/category-record-details'
import { CategoryCardStat } from '@/widgets/people/ui/category-card-stat'
import { RecordTimeValue } from '@/shared/ui/record-time-value/RecordTimeValue'

export function CategoryStatsCard({ stats }: { stats: CategoryStats }) {
  const { category, count, best, bestAo5 } = stats
  const locale = useLocale()
  const tSolveCard = useTranslations('Index.PeoplePage.solve-card')
  const tCubes = useTranslations('Index.PeoplePage.cubes-tab')
  const [isOpen, setIsOpen] = React.useState(false)
  const canExpand = Boolean(best?.solve || bestAo5?.solves || bestAo5?.window)
  const formatDate = (time: number) => dayjs(time).locale(locale).format('ll')

  return (
    <motion.div
      className="border-b border-border/40 last:border-b-0"
      variants={{ hidden: { opacity: 0 }, show: { opacity: 1 } }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
    >
      <button
        type="button"
        onClick={() => canExpand && setIsOpen((prev) => !prev)}
        aria-expanded={canExpand ? isOpen : undefined}
        className={cn(
          'relative flex w-full flex-col gap-3 p-3 text-left transition-colors duration-150 @xl/tab:flex-row @xl/tab:items-center @xl/tab:gap-6 @xl/tab:py-2.5',
          canExpand ? 'cursor-pointer hover:bg-muted/40' : 'cursor-default'
        )}
      >
        <span className="flex items-center gap-2.5 @xl/tab:w-36 @xl/tab:shrink-0">
          <CubeCategoryTile category={category} />
          <CategoryBadge category={category as CubeCategory} className="shrink-0" />
        </span>
        {canExpand && (
          <ChevronDown
            className={cn(
              'absolute top-5 right-3 size-4 text-muted-foreground transition-transform duration-200 @xl/tab:top-1/2 @xl/tab:-mt-2',
              isOpen && 'rotate-180'
            )}
          />
        )}
        <span className="grid w-full grid-cols-3 gap-3 @xl/tab:min-w-0 @xl/tab:flex-1 @xl/tab:pr-8">
          <CategoryCardStat
            label={tSolveCard('single')}
            caption={best ? [`${best.cubeName} · ${formatDate(best.endTime)}`] : undefined}
          >
            <RecordTimeValue size="lg" value={best ? formatTime(best.time) : '--'} />
          </CategoryCardStat>
          <CategoryCardStat
            label={tCubes('col-ao5')}
            caption={bestAo5 ? [`${bestAo5.cubeName} · ${formatDate(bestAo5.endTime)}`] : undefined}
          >
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
