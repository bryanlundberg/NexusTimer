import * as React from 'react'
import Image from 'next/image'
import { cubeCollection } from '@/shared/const/cube-collection'
import moment from 'moment'
import { Cube } from '@/entities/cube/model/types'
import { useLocale, useTranslations } from 'next-intl'
import formatTime from '@/shared/lib/formatTime'
import { CategoryBadge } from '@/shared/ui/category-badge/CategoryBadge'
import _ from 'lodash'
import { motion } from 'motion/react'
import calcBestAo from '@/shared/lib/statistics/calcBestAo'
import { AreaChart, Area, ResponsiveContainer } from 'recharts'
import { GRID } from '@/widgets/people/ui/cubes-tab-content'

interface PeopleCubeCardProps {
  cube: Cube
  index: number
}

export function PeopleCubeCard({ cube, index }: PeopleCubeCardProps) {
  const locale = useLocale()
  const t = useTranslations('Index.CubesPage')
  const allSolves = [...(cube.solves.all || []), ...(cube.solves.session || [])].filter((s) => !s.isDeleted)

  const counts = allSolves.reduce(
    (acc, s) => ({
      successCount: acc.successCount + (!s.dnf && !s.plus2 && !s.isDeleted ? 1 : 0),
      plus2Count: acc.plus2Count + (!s.dnf && s.plus2 && !s.isDeleted ? 1 : 0),
      dnfCount: acc.dnfCount + (s.dnf && !s.isDeleted ? 1 : 0)
    }),
    { successCount: 0, plus2Count: 0, dnfCount: 0 }
  )

  const { successCount, plus2Count, dnfCount } = counts
  const totalSolves = successCount + plus2Count + dnfCount

  const validSolves = allSolves.filter((s) => !s.dnf)
  const pb = validSolves.length > 0 ? _.minBy(validSolves, (s) => s.time + (s.plus2 ? 2000 : 0)) : null
  const pbTime = pb ? pb.time + (pb.plus2 ? 2000 : 0) : null

  const ao5Ms = calcBestAo(allSolves, 5)
  const ao5Str = !isFinite(ao5Ms) || ao5Ms <= 0 ? '--' : formatTime(ao5Ms)

  const totalTime = allSolves.reduce((acc, s) => acc + (s.time || 0), 0)

  const cubeImg = cubeCollection.find((item) => item.name === cube.category)?.src || ''

  const chartData = React.useMemo(() => {
    const valid = allSolves.filter((s) => !s.dnf && s.time > 0)
    return valid.slice(-20).map((s) => ({ v: s.time + (s.plus2 ? 2000 : 0) }))
  }, [allSolves])

  return (
    <motion.div
      className={`grid ${GRID} items-center gap-x-4 px-3 py-3 border-b border-border/40 last:border-b-0 hover:bg-muted/20 border-l-2 border-l-transparent hover:border-l-primary transition-colors duration-150`}
      variants={{ hidden: { opacity: 0 }, show: { opacity: 1 } }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
    >
      {/* Cube image */}
      <Image
        unoptimized
        src={cubeImg}
        alt={cube.name}
        className="object-scale-down rounded-lg bg-muted/40 border border-border/30 p-0.5"
        draggable={false}
        width={40}
        height={40}
      />

      {/* Name + category badge + date */}
      <div className="min-w-0">
        <div className="flex items-center gap-2 mb-0.5">
          <span className="font-bold text-sm truncate">{cube.name}</span>
          <CategoryBadge category={cube.category} className="text-[10px] px-1.5 py-0 h-4 shrink-0" />
        </div>
        <span className="text-[10px] text-muted-foreground">
          {t('created')}: {moment(cube.createdAt).locale(locale).format('LL')}
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

      {/* Distribution: sparkline + counters */}
      <div className="flex flex-col gap-1 w-full">
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
        <div className="flex items-center gap-2">
          <span className="size-1.5 rounded-full bg-green-500 shrink-0" />
          <span className="text-[10px] tabular-nums text-muted-foreground">{successCount}</span>
          <span className="size-1.5 rounded-full bg-yellow-500 shrink-0" />
          <span className="text-[10px] tabular-nums text-muted-foreground">{plus2Count}</span>
          <span className="size-1.5 rounded-full bg-red-500 shrink-0" />
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
