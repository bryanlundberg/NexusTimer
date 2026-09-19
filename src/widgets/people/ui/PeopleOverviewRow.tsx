import * as React from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { useLocale, useTranslations } from 'next-intl'
import { ChevronDown } from 'lucide-react'
import dayjs from '@/shared/lib/dayjs'
import formatTime from '@/shared/lib/formatTime'
import { CubeCategoryTile } from '@/shared/ui/cube-category-icon/CubeCategoryIcon'
import { CategoryBadge } from '@/shared/ui/category-badge/CategoryBadge'
import type { AoWindowSolve, CategoryStats } from '@/entities/user-stats/model/types'
import { CubeCategory } from '@/shared/const/cube-categories'
import { GRID } from '@/widgets/people/ui/overview-tab-content'

interface PeopleOverviewRowProps {
  stats: CategoryStats
}

export default function PeopleOverviewRow({ stats }: PeopleOverviewRowProps) {
  const { category, count, best, bestAo5 } = stats
  const locale = useLocale()
  const tSolveCard = useTranslations('Index.PeoplePage.solve-card')
  const tCubes = useTranslations('Index.PeoplePage.cubes-tab')
  const tTimeline = useTranslations('Index.PeoplePage.timeline-tab')
  const [isOpen, setIsOpen] = React.useState(false)

  const bestTime = best ? best.time : null
  const ao5Str = bestAo5 ? formatTime(bestAo5.time) : '--'
  const ao5Window = bestAo5?.window ?? null

  const ao5Edges = React.useMemo(() => {
    if (!ao5Window) return null
    const sorted = [...ao5Window].sort((a, b) => (a.dnf ? Infinity : a.time) - (b.dnf ? Infinity : b.time))
    return { bestId: sorted[0].id, worstId: sorted[sorted.length - 1].id }
  }, [ao5Window])

  return (
    <div className="border-b border-border/40 last:border-b-0">
      <motion.div
        onClick={() => setIsOpen((prev) => !prev)}
        aria-expanded={isOpen}
        className={`grid ${GRID} items-center gap-x-4 px-3 py-3 cursor-pointer hover:bg-muted/20 border-l-2 border-l-transparent hover:border-l-primary transition-colors duration-150`}
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

        {/* Total solves */}
        <span className="text-sm font-bold tabular-nums">{count.toLocaleString(locale)}</span>

        {/* Expand indicator */}
        <div className="flex items-center justify-center size-6 rounded-md text-muted-foreground">
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
            <div className="px-3 pb-3 flex flex-wrap gap-x-10 gap-y-3">
              <DetailGroup title={tSolveCard('single')} value={bestTime ? formatTime(bestTime) : '--'}>
                <DetailRow label={tTimeline('col-cube-record')} value={best?.cubeName ?? '--'} />
                <DetailRow
                  label={tTimeline('col-date')}
                  value={best ? dayjs(best.endTime).locale(locale).format('LL') : '--'}
                />
              </DetailGroup>

              <DetailGroup
                title={tCubes('col-ao5')}
                value={ao5Str}
                extra={
                  ao5Window && ao5Edges ? (
                    <span className="text-[11px] text-muted-foreground tabular-nums">{`[${ao5Window
                      .map((solve) => {
                        const label = formatSolveLabel(solve)
                        const isEdge = solve.id === ao5Edges.bestId || solve.id === ao5Edges.worstId
                        return isEdge ? `(${label})` : label
                      })
                      .join(' ')}]`}</span>
                  ) : null
                }
              >
                <DetailRow label={tTimeline('col-cube-record')} value={bestAo5?.cubeName ?? '--'} />
                <DetailRow
                  label={tTimeline('col-date')}
                  value={bestAo5 ? dayjs(bestAo5.endTime).locale(locale).format('LL') : '--'}
                />
              </DetailGroup>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function DetailGroup({
  title,
  value,
  extra,
  children
}: {
  title: string
  value: string
  extra?: React.ReactNode
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col gap-1 min-w-0">
      <div className="flex items-baseline gap-1.5 flex-wrap">
        <span className="text-[9px] font-semibold uppercase tracking-wider text-muted-foreground">{title}</span>
        <span className="text-xs font-bold tabular-nums">{value}</span>
        {extra}
      </div>
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1">{children}</div>
    </div>
  )
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <span className="text-[11px] text-muted-foreground">
      <span className="text-foreground/70">{label}:</span> {value}
    </span>
  )
}

function formatSolveLabel(solve: AoWindowSolve): string {
  return solve.dnf ? 'DNF' : `${formatTime(solve.time)}${solve.plus2 ? '+' : ''}`
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
