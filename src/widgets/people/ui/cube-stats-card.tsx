import { motion } from 'motion/react'
import { useLocale, useTranslations } from 'next-intl'
import dayjs from '@/shared/lib/dayjs'
import formatTime from '@/shared/lib/formatTime'
import { formatDurationClock } from '@/shared/lib/formatDuration'
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
  const created = dayjs(cube.createdAt).locale(locale)
  const createdLabel = created.format(created.year() === dayjs().year() ? 'D MMM' : 'D MMM YY')

  return (
    <motion.div
      className="grid grid-cols-1 gap-2.5 border-b border-border/40 p-3 last:border-b-0 @3xl/tab:grid-cols-[15rem_minmax(0,1fr)_7rem] @3xl/tab:items-center @3xl/tab:gap-5 @3xl/tab:py-2.5"
      variants={{ hidden: { opacity: 0 }, show: { opacity: 1 } }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
    >
      <div className="flex min-w-0 items-center gap-2.5">
        <CubeCategoryTile category={cube.category} />
        <div className="flex min-w-0 flex-col gap-0.5">
          <span className="truncate text-sm font-bold" title={cube.name}>
            {cube.name}
          </span>
          <div className="flex min-w-0 items-center gap-2">
            <CategoryBadge category={cube.category} className="shrink-0" />
            <span className="truncate text-[10px] text-muted-foreground">
              {t('created')}: {createdLabel}
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-3">
        <CategoryCardStat label={tPeople('col-best')}>
          <RecordTimeValue size="md" value={cube.best ? formatTime(cube.best) : '--'} />
        </CategoryCardStat>
        <CategoryCardStat label={tPeople('col-ao5')}>
          <RecordTimeValue size="md" value={cube.bestAo5 !== null ? formatTime(cube.bestAo5) : '--'} />
        </CategoryCardStat>
        <CategoryCardStat label={tPeople('col-solves')}>
          <span className="text-lg font-bold tabular-nums">{totalSolves.toLocaleString(locale)}</span>
        </CategoryCardStat>
        <CategoryCardStat label={tStats('time-on-timer')}>
          <span className="truncate text-lg font-bold tabular-nums">
            {cube.totalTime > 0 ? formatDurationClock(cube.totalTime) : '--'}
          </span>
        </CategoryCardStat>
      </div>

      <CubeSolveDistribution counts={cube.counts} />
    </motion.div>
  )
}
