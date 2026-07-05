import * as React from 'react'
import Image from 'next/image'
import _ from 'lodash'
import { motion } from 'motion/react'
import { AreaChart, Area, ResponsiveContainer } from 'recharts'
import { useLocale } from 'next-intl'
import dayjs from '@/shared/lib/dayjs'
import formatTime from '@/shared/lib/formatTime'
import calcBestAo from '@/shared/lib/statistics/calcBestAo'
import { cubeCollection } from '@/shared/const/cube-collection'
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

  const counts = React.useMemo(
    () =>
      solves.reduce(
        (acc, s) => ({
          plus2Count: acc.plus2Count + (!s.dnf && s.plus2 ? 1 : 0),
          dnfCount: acc.dnfCount + (s.dnf ? 1 : 0)
        }),
        { plus2Count: 0, dnfCount: 0 }
      ),
    [solves]
  )

  const validSolves = React.useMemo(() => solves.filter((s) => !s.dnf), [solves])
  const best = React.useMemo(
    () => (validSolves.length > 0 ? _.minBy(validSolves, (s) => s.time + (s.plus2 ? 2000 : 0)) : null),
    [validSolves]
  )
  const bestTime = best ? best.time + (best.plus2 ? 2000 : 0) : null

  const ao5Ms = React.useMemo(() => calcBestAo(ordered, 5), [ordered])
  const ao5Str = !isFinite(ao5Ms) || ao5Ms <= 0 ? '--' : formatTime(ao5Ms)

  const chartData = React.useMemo(
    () =>
      ordered
        .filter((s) => !s.dnf && s.time > 0)
        .slice(-20)
        .map((s) => ({ v: s.time + (s.plus2 ? 2000 : 0) })),
    [ordered]
  )

  const cubeImg = cubeCollection.find((item) => item.name === category)?.src || ''

  return (
    <motion.div
      className={`grid ${GRID} items-center gap-x-4 px-3 py-3 border-b border-border/40 last:border-b-0 hover:bg-muted/20 border-l-2 border-l-transparent hover:border-l-primary transition-colors duration-150`}
      variants={{ hidden: { opacity: 0 }, show: { opacity: 1 } }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
    >
      {/* Category with image */}
      <div className="flex items-center gap-2.5 min-w-0">
        {cubeImg && (
          <Image
            unoptimized
            src={cubeImg}
            alt={category}
            className="object-scale-down rounded-lg bg-muted/40 border border-border/30 p-0.5 shrink-0"
            draggable={false}
            width={36}
            height={36}
          />
        )}
        <CategoryBadge category={category as CubeCategory} className="text-[11px] px-1.5 py-0 h-5 shrink-0" />
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

      {/* Total +2 */}
      <div className="flex items-center gap-1.5">
        <span className="size-1.5 rounded-full bg-yellow-500 shrink-0" />
        <span className="text-sm tabular-nums">{counts.plus2Count.toLocaleString(locale)}</span>
      </div>

      {/* Total DNF */}
      <div className="flex items-center gap-1.5">
        <span className="size-1.5 rounded-full bg-red-500 shrink-0" />
        <span className="text-sm tabular-nums">{counts.dnfCount.toLocaleString(locale)}</span>
      </div>

      {/* Graph */}
      <div className="h-8 w-full">
        {chartData.length > 1 ? (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 2, right: 0, left: 0, bottom: 2 }}>
              <Area
                type="monotone"
                dataKey="v"
                stroke="var(--primary)"
                strokeWidth={1.5}
                fill="var(--primary)"
                fillOpacity={0.1}
                dot={false}
                isAnimationActive={false}
              />
            </AreaChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex items-center justify-center h-full text-muted-foreground text-xs">—</div>
        )}
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
