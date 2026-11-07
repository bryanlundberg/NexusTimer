import { motion } from 'motion/react'
import { useLocale, useTranslations } from 'next-intl'
import dayjs from '@/shared/lib/dayjs'
import formatTime from '@/shared/lib/formatTime'
import { CubeCategoryTile } from '@/shared/ui/cube-category-icon/CubeCategoryIcon'
import { CategoryBadge } from '@/shared/ui/category-badge/CategoryBadge'
import type { CubeStats } from '@/entities/user-stats/model/types'
import { CategoryCardStat } from '@/widgets/people/ui/category-card-stat'
import { RecordTimeValue } from '@/shared/ui/record-time-value/RecordTimeValue'
import { CubeSolveDistribution } from '@/widgets/people/ui/cube-solve-distribution'

export function CubeStatsCard({ cube }: { cube: CubeStats }) {
  const locale = useLocale()
  const t = useTranslations('Index.CubesPage')
  const tPeople = useTranslations('Index.PeoplePage.cubes-tab')
  const tStats = useTranslations('Index.PeoplePage.stats')
  const totalSolves = cube.counts.ok + cube.counts.plus2 + cube.counts.dnf

  return (
    <motion.div
      className="flex flex-col gap-3 border border-border/60 bg-card/40 p-3"
      variants={{ hidden: { opacity: 0 }, show: { opacity: 1 } }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
    >
      <div className="flex items-center gap-2.5 min-w-0">
        <CubeCategoryTile category={cube.category} />
        <div className="flex min-w-0 flex-col gap-0.5">
          <div className="flex min-w-0 items-center gap-2">
            <span className="truncate text-sm font-bold" title={cube.name}>
              {cube.name}
            </span>
            <CategoryBadge category={cube.category} className="shrink-0" />
          </div>
          <span className="text-[10px] text-muted-foreground">
            {t('created')}: {dayjs(cube.createdAt).locale(locale).format('LL')}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 @sm/tab:grid-cols-4 @xl/tab:grid-cols-2">
        <CategoryCardStat label={tPeople('col-best')}>
          <RecordTimeValue size="lg" value={cube.best ? formatTime(cube.best) : '--'} />
        </CategoryCardStat>
        <CategoryCardStat label={tPeople('col-ao5')}>
          <RecordTimeValue size="lg" value={cube.bestAo5 !== null ? formatTime(cube.bestAo5) : '--'} />
        </CategoryCardStat>
        <CategoryCardStat label={tPeople('col-solves')}>
          <span className="text-xl font-bold tabular-nums">{totalSolves.toLocaleString(locale)}</span>
        </CategoryCardStat>
        <CategoryCardStat label={tStats('time-on-timer')}>
          <RecordTimeValue size="lg" value={cube.totalTime > 0 ? formatTime(cube.totalTime) : '--'} />
        </CategoryCardStat>
      </div>

      <CategoryCardStat label={tPeople('col-distribution')}>
        <CubeSolveDistribution counts={cube.counts} />
      </CategoryCardStat>
    </motion.div>
  )
}
