import * as React from 'react'
import _ from 'lodash'
import { motion } from 'motion/react'
import { useLocale } from 'next-intl'
import dayjs from '@/shared/lib/dayjs'
import formatTime from '@/shared/lib/formatTime'
import calcBestAo from '@/shared/lib/statistics/calcBestAo'
import { CubeCategoryTile } from '@/shared/ui/cube-category-icon/CubeCategoryIcon'
import { CategoryBadge } from '@/shared/ui/category-badge/CategoryBadge'
import { Solve } from '@/entities/solve/model/types'
import { CubeCategory } from '@/shared/const/cube-categories'
import { GRID } from '@/widgets/people/ui/overview-tab-content'

export type CategorySolve = Solve & { category: CubeCategory; cubeName: string }

interface PeopleOverviewRowProps {
  category: string
  solves: CategorySolve[]
}

export default function PeopleOverviewRow({ category, solves }: PeopleOverviewRowProps) {
  const locale = useLocale()

  const ordered = React.useMemo(() => _.orderBy(solves, (s) => s.startTime, 'asc'), [solves])

  const validSolves = React.useMemo(() => solves.filter((s) => !s.dnf), [solves])
  const best = React.useMemo(
    () => (validSolves.length > 0 ? _.minBy(validSolves, (s) => s.time + (s.plus2 ? 2000 : 0)) : null),
    [validSolves]
  )
  const bestTime = best ? best.time + (best.plus2 ? 2000 : 0) : null

  const ao5Ms = React.useMemo(() => calcBestAo(ordered, 5), [ordered])
  const ao5Str = !isFinite(ao5Ms) || ao5Ms <= 0 ? '--' : formatTime(ao5Ms)

  return (
    <motion.div
      className={`grid ${GRID} items-center gap-x-4 px-3 py-3 border-b border-border/40 last:border-b-0 hover:bg-muted/20 border-l-2 border-l-transparent hover:border-l-primary transition-colors duration-150`}
      variants={{ hidden: { opacity: 0 }, show: { opacity: 1 } }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
    >
      {/* Category with image */}
      <div className="flex items-center gap-2.5 min-w-0">
        <CubeCategoryTile category={category} />
        <CategoryBadge category={category as CubeCategory} className="shrink-0" />
      </div>

      {/* Single */}
      <StatCell value={bestTime ? formatTime(bestTime) : '--'} />

      {/* Ao5 */}
      <StatCell value={ao5Str} />

      {/* Cube (that holds the best single) */}
      <span className="text-sm font-medium truncate" title={best?.cubeName}>
        {best?.cubeName ?? '--'}
      </span>

      {/* Date of best single */}
      <span className="text-xs text-muted-foreground">
        {best ? dayjs(best.endTime).locale(locale).format('LL') : '--'}
      </span>

      {/* Total solves */}
      <span className="text-sm font-bold tabular-nums">{solves.length.toLocaleString(locale)}</span>
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
