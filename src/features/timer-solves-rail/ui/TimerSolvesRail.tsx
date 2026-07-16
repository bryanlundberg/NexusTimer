'use client'

import * as React from 'react'
import { useMemo, useRef, useState } from 'react'
import { motion } from 'motion/react'
import { useVirtualizer } from '@tanstack/react-virtual'
import { useTranslations } from 'next-intl'
import { Tabs } from '@/components/ui/tabs'
import ScrollableUnderlineTabs from '@/shared/ui/animated-tabs/ScrollableUnderlineTabs'
import { HistoryIcon, ShellIcon } from 'lucide-react'
import { cn } from '@/shared/lib/utils'
import { sort } from 'fast-sort'
import formatTime from '@/shared/lib/formatTime'
import calcCurrentAo from '@/shared/lib/statistics/calcCurrentAo'
import calcBestAo from '@/shared/lib/statistics/calcBestAo'
import getBestTime from '@/shared/lib/statistics/getBestTime'
import { Solve } from '@/entities/solve/model/types'
import { useTimerStore } from '@/shared/model/timer/useTimerStore'
import { useTimerRailStore } from '@/features/timer-solves-rail/model/useTimerRailStore'
import { useOverlayStore } from '@/shared/model/overlay-store/useOverlayStore'
import SolveDetails from '@/features/manage-solves/ui/SolveDetails'

type RailTab = 'session' | 'cube'

const GRID_COLS = '1.3rem minmax(0, 1fr) minmax(0, 1fr) minmax(0, 1fr)'
const STAT_COLS = '2.5rem minmax(0, 1fr) minmax(0, 1fr)'
const ROW_HEIGHT = 36

export default function TimerSolvesRail() {
  const [tab, setTab] = useState<RailTab>('session')
  const isOpen = useTimerRailStore((state) => state.isOpen)
  const selectedCube = useTimerStore((state) => state.selectedCube)
  const cubes = useTimerStore((state) => state.cubes)
  const scrollRef = useRef<HTMLDivElement>(null)
  const open = useOverlayStore((state) => state.open)
  const t = useTranslations('Index.SolvesRail')

  const openSolveDetails = (solve: Solve) => {
    open({ id: 'solve-details', metadata: { ...solve }, component: <SolveDetails /> })
  }

  const tabs = [
    { value: 'session', icon: ShellIcon, label: t('session') },
    { value: 'cube', icon: HistoryIcon, label: t('cube') }
  ]

  const solves = useMemo<Solve[]>(() => {
    if (!selectedCube) return []
    if (tab === 'cube') return selectedCube.solves.session
    const combined = (cubes ?? [])
      .filter((cube) => cube.category === selectedCube.category)
      .flatMap((cube) => cube.solves?.session ?? [])
    return sort(combined).desc((solve) => solve.endTime)
  }, [cubes, selectedCube, tab])

  const bestLabel = useMemo(() => {
    const valid = solves.filter((solve) => !solve.dnf)
    return valid.length === 0 ? '-' : formatTime(getBestTime({ solves: valid }))
  }, [solves])

  const stats = useMemo(() => {
    const actualAo = (n: number) => {
      if (solves.length < n) return '-'
      const ao = calcCurrentAo(solves, n)
      return ao === 0 ? 'DNF' : formatTime(ao)
    }

    const bestAo = (n: number) => {
      const best = calcBestAo(solves, n)
      return Number.isFinite(best) && best > 0 ? formatTime(best) : '-'
    }

    const valid = solves.filter((solve) => !solve.dnf)
    const current = solves[0]
    const actualSingle = !current ? '-' : current.dnf ? 'DNF' : formatTime(current.time)
    const bestSingle = valid.length === 0 ? '-' : formatTime(getBestTime({ solves: valid }))

    return [
      { label: 'Single', actual: actualSingle, best: bestSingle },
      { label: 'Ao3', actual: actualAo(3), best: bestAo(3) },
      { label: 'Ao5', actual: actualAo(5), best: bestAo(5) },
      { label: 'Ao12', actual: actualAo(12), best: bestAo(12) }
    ]
  }, [solves])

  const rows = useMemo(() => {
    const formatAo = (window: Solve[], n: number) => {
      if (window.length < n) return '-'
      const ao = calcCurrentAo(window, n)
      return ao === 0 ? 'DNF' : formatTime(ao)
    }
    return solves.map((solve, index) => {
      return {
        id: solve.id,
        dnf: solve.dnf,
        time: solve.dnf ? 'DNF' : `${formatTime(solve.time)}${solve.plus2 ? '+' : ''}`,
        number: solves.length - index,
        ao5: formatAo(solves.slice(index, index + 5), 5),
        ao12: formatAo(solves.slice(index, index + 12), 12)
      }
    })
  }, [solves])

  const virtualizer = useVirtualizer({
    count: rows.length,
    getScrollElement: () => scrollRef.current,
    estimateSize: () => ROW_HEIGHT,
    overscan: 10
  })

  return (
    <motion.aside
      data-testid="timer-solves-rail"
      initial={false}
      animate={{ width: isOpen ? 'auto' : 0, opacity: isOpen ? 1 : 0 }}
      transition={{ duration: 0.28, ease: [0.4, 0, 0.2, 1] }}
      className="hidden md:flex shrink-0 min-h-0 overflow-hidden"
    >
      <div className="flex h-full w-52 lg:w-64 min-h-0 flex-col overflow-hidden border-s border-border bg-sidebar/25 backdrop-blur-md">
        {/* Switch */}
        <div className="p-2">
          <Tabs value={tab} onValueChange={(value) => setTab(value as RailTab)}>
            <ScrollableUnderlineTabs items={tabs} activeValue={tab} layoutId="timer-rail-tab-indicator" />
          </Tabs>
        </div>

        {/* Summary strip */}
        <div className="flex items-center justify-between px-2 pb-2 text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
          <span className="tabular-nums">{t('solves', { count: solves.length })}</span>
          <span className="inline-flex items-center gap-1">
            <span>{t('best')}</span>
            <span className="font-mono tabular-nums text-foreground">{bestLabel}</span>
          </span>
        </div>

        {/* Stats */}
        <div className="px-3 pb-3">
          <div
            className="grid items-end gap-x-2 pb-1 text-[9px] font-medium uppercase tracking-[0.12em] text-muted-foreground/70"
            style={{ gridTemplateColumns: STAT_COLS }}
          >
            <span />
            <span className="text-right">Actual</span>
            <span className="text-right">Best</span>
          </div>
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="grid items-baseline gap-x-2 py-0.5"
              style={{ gridTemplateColumns: STAT_COLS }}
            >
              <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                {stat.label}
              </span>
              <span className="text-right font-mono text-xs tabular-nums text-muted-foreground">{stat.actual}</span>
              <span className="text-right font-mono text-xs font-semibold tabular-nums text-foreground">
                {stat.best}
              </span>
            </div>
          ))}
        </div>

        {/* Column header */}
        <div
          className="grid items-center gap-1.5 border-y border-border bg-muted/30 px-2 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground"
          style={{ gridTemplateColumns: GRID_COLS }}
        >
          <span>#</span>
          <span className="text-right">{t('time')}</span>
          <span className="text-right">Ao5</span>
          <span className="text-right">Ao12</span>
        </div>

        {/* Rows (virtualized) */}
        {rows.length === 0 ? (
          <p className="px-3 py-6 text-center text-xs text-muted-foreground">
            {!selectedCube ? t('select-cube') : t('no-solves')}
          </p>
        ) : (
          <div ref={scrollRef} className="min-h-0 flex-1 overflow-auto scrollbar-hide">
            <div style={{ height: virtualizer.getTotalSize(), width: '100%', position: 'relative' }}>
              {virtualizer.getVirtualItems().map((virtualRow) => {
                const row = rows[virtualRow.index]
                const solve = solves[virtualRow.index]
                return (
                  <div
                    key={row.id}
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: ROW_HEIGHT,
                      transform: `translateY(${virtualRow.start}px)`
                    }}
                  >
                    <button
                      type="button"
                      onClick={() => openSolveDetails(solve)}
                      className="grid h-full w-full items-center gap-1.5 border-b border-border/50 px-2 text-left transition-colors hover:bg-muted/50"
                      style={{ gridTemplateColumns: GRID_COLS }}
                    >
                      <span className="text-xs font-semibold tabular-nums text-muted-foreground">{row.number}</span>

                      <span
                        className={cn(
                          'text-right font-mono text-sm font-semibold tabular-nums',
                          row.dnf && 'text-red-500'
                        )}
                      >
                        {row.time}
                      </span>

                      <span className="text-right font-mono text-xs tabular-nums text-muted-foreground">{row.ao5}</span>

                      <span className="text-right font-mono text-xs tabular-nums text-muted-foreground">
                        {row.ao12}
                      </span>
                    </button>
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </div>
    </motion.aside>
  )
}
