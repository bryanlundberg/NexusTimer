import * as React from 'react'
import { CubeCategoryTile } from '@/shared/ui/cube-category-icon/CubeCategoryIcon'
import dayjs from '@/shared/lib/dayjs'
import type { CubeStats } from '@/entities/user-stats/model/types'
import { useLocale, useTranslations } from 'next-intl'
import formatTime from '@/shared/lib/formatTime'
import { CategoryBadge } from '@/shared/ui/category-badge/CategoryBadge'
import { motion } from 'motion/react'
import { GRID } from '@/widgets/people/ui/cubes-tab-content'

interface PeopleCubeCardProps {
  cube: CubeStats
  index: number
}

export function PeopleCubeCard({ cube, index }: PeopleCubeCardProps) {
  const locale = useLocale()
  const t = useTranslations('Index.CubesPage')
  const { ok: successCount, plus2: plus2Count, dnf: dnfCount } = cube.counts
  const totalSolves = successCount + plus2Count + dnfCount

  const pbTime = cube.best
  const ao5Str = cube.bestAo5 !== null ? formatTime(cube.bestAo5) : '--'
  const totalTime = cube.totalTime

  return (
    <motion.div
      className={`grid ${GRID} items-center gap-x-4 px-3 py-3 border-b border-border/40 last:border-b-0 hover:bg-muted/20 border-l-2 border-l-transparent hover:border-l-primary transition-colors duration-150`}
      variants={{ hidden: { opacity: 0 }, show: { opacity: 1 } }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
    >
      {/* Cube image */}
      <CubeCategoryTile category={cube.category} />

      {/* Name + category badge + date */}
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

      {/* Best */}
      <StatCell value={pbTime ? formatTime(pbTime) : '--'} />

      {/* Ao5 */}
      <StatCell value={ao5Str} />

      {/* Solves */}
      <span className="text-sm font-bold tabular-nums">{totalSolves}</span>

      {/* Time on cube */}
      <StatCell value={totalTime > 0 ? formatTime(totalTime) : '--'} />

      {/* Distribution: segmented pill + counters */}
      <div className="flex flex-col gap-1.5 w-full">
        <div className="h-2 w-full overflow-hidden bg-muted/50 flex">
          {totalSolves > 0 ? (
            <>
              {successCount > 0 && (
                <span className="h-full bg-green-500" style={{ width: `${(successCount / totalSolves) * 100}%` }} />
              )}
              {plus2Count > 0 && (
                <span className="h-full bg-yellow-500" style={{ width: `${(plus2Count / totalSolves) * 100}%` }} />
              )}
              {dnfCount > 0 && (
                <span className="h-full bg-red-500" style={{ width: `${(dnfCount / totalSolves) * 100}%` }} />
              )}
            </>
          ) : null}
        </div>
        <div className="flex items-center gap-2">
          <span className="size-1.5 bg-green-500 shrink-0" />
          <span className="text-[10px] tabular-nums text-muted-foreground">{successCount}</span>
          <span className="size-1.5 bg-yellow-500 shrink-0" />
          <span className="text-[10px] tabular-nums text-muted-foreground">{plus2Count}</span>
          <span className="size-1.5 bg-red-500 shrink-0" />
          <span className="text-[10px] tabular-nums text-muted-foreground">{dnfCount}</span>
        </div>
      </div>
    </motion.div>
  )
}

function StatCell({ value }: { value: string }) {
  const [main, decimal] = value !== '--' && value.includes('.') ? value.split('.') : [value, null]
  return (
    <div className="flex items-baseline gap-0.5">
      {value === '--' ? (
        <span className="text-sm font-bold text-muted-foreground">--</span>
      ) : (
        <>
          <span className="text-sm font-bold tabular-nums">{main}</span>
          {decimal && <span className="text-xs text-muted-foreground tabular-nums">.{decimal}</span>}
        </>
      )}
    </div>
  )
}

export default PeopleCubeCard
