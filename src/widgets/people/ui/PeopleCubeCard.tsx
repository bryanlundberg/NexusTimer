import * as React from 'react'
import { CubeCategoryTile } from '@/shared/ui/cube-category-icon/CubeCategoryIcon'
import dayjs from '@/shared/lib/dayjs'
import type { CubeStats } from '@/entities/user-stats/model/types'
import { useLocale, useTranslations } from 'next-intl'
import formatTime from '@/shared/lib/formatTime'
import { CategoryBadge } from '@/shared/ui/category-badge/CategoryBadge'
import { motion } from 'motion/react'
import { GRID } from '@/widgets/people/ui/cubes-tab-content'
import { RecordTimeValue } from '@/shared/ui/record-time-value/RecordTimeValue'
import { CubeSolveDistribution } from '@/widgets/people/ui/cube-solve-distribution'

interface PeopleCubeCardProps {
  cube: CubeStats
  index: number
}

export function PeopleCubeCard({ cube }: PeopleCubeCardProps) {
  const locale = useLocale()
  const t = useTranslations('Index.CubesPage')
  const totalSolves = cube.counts.ok + cube.counts.plus2 + cube.counts.dnf

  return (
    <motion.div
      className={`grid ${GRID} items-center gap-x-4 px-3 py-3 border-b border-border/40 last:border-b-0 hover:bg-muted/40 transition-colors duration-150`}
      variants={{ hidden: { opacity: 0 }, show: { opacity: 1 } }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
    >
      <CubeCategoryTile category={cube.category} />

      <div className="min-w-0">
        <div className="flex items-center gap-2 mb-0.5">
          <span className="font-bold text-sm truncate" title={cube.name}>
            {cube.name}
          </span>
          <CategoryBadge category={cube.category} className="shrink-0" />
        </div>
        <span className="text-[10px] text-muted-foreground">
          {t('created')}: {dayjs(cube.createdAt).locale(locale).format('LL')}
        </span>
      </div>

      <RecordTimeValue value={cube.best ? formatTime(cube.best) : '--'} />

      <RecordTimeValue value={cube.bestAo5 !== null ? formatTime(cube.bestAo5) : '--'} />

      <span className="text-sm font-bold tabular-nums">{totalSolves}</span>

      <RecordTimeValue value={cube.totalTime > 0 ? formatTime(cube.totalTime) : '--'} />

      <CubeSolveDistribution counts={cube.counts} />
    </motion.div>
  )
}

export default PeopleCubeCard
