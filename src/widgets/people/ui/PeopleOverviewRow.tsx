import * as React from 'react'
import _ from 'lodash'
import { AnimatePresence, motion } from 'motion/react'
import { useLocale, useTranslations } from 'next-intl'
import { ChevronDown } from 'lucide-react'
import dayjs from '@/shared/lib/dayjs'
import formatTime from '@/shared/lib/formatTime'
import calcBestAo, { findBestAoWindow } from '@/shared/lib/statistics/calcBestAo'
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
  const tSolveCard = useTranslations('Index.PeoplePage.solve-card')
  const tCubes = useTranslations('Index.PeoplePage.cubes-tab')
  const tTimeline = useTranslations('Index.PeoplePage.timeline-tab')
  const [isOpen, setIsOpen] = React.useState(false)

  const ordered = React.useMemo(() => _.orderBy(solves, (s) => s.endTime, 'asc'), [solves])

  const validSolves = React.useMemo(() => solves.filter((s) => !s.dnf), [solves])
  const best = React.useMemo(() => (validSolves.length > 0 ? _.minBy(validSolves, (s) => s.time) : null), [validSolves])
  const bestTime = best ? best.time : null

  const ao5Ms = React.useMemo(() => calcBestAo(ordered, 5), [ordered])
  const ao5Str = !isFinite(ao5Ms) || ao5Ms <= 0 ? '--' : formatTime(ao5Ms)

  const ao5Window = React.useMemo(
    () => (isFinite(ao5Ms) && ao5Ms > 0 ? findBestAoWindow(ordered, 5) : null),
    [ordered, ao5Ms]
  )
  // The cube/date the average belongs to is the cube/date of its most recent solve.
  const ao5Last = ao5Window ? ao5Window[ao5Window.length - 1] : null

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
        <span className="text-sm font-bold tabular-nums">{solves.length.toLocaleString(locale)}</span>

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
                <DetailRow label={tTimeline('col-cube-record')} value={ao5Last?.cubeName ?? '--'} />
                <DetailRow
                  label={tTimeline('col-date')}
                  value={ao5Last ? dayjs(ao5Last.endTime).locale(locale).format('LL') : '--'}
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

function formatSolveLabel(solve: CategorySolve): string {
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
