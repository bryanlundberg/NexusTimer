'use client'

import { useMemo } from 'react'
import { Cube } from '@/entities/cube/model/types'
import { Solve } from '@/entities/solve/model/types'
import { cn } from '@/shared/lib/utils'
import prettyMilliseconds from 'pretty-ms'
import { useTranslations } from 'next-intl'

interface StatItemProps {
  label: string
  value: string
  sub?: string
  highlight?: boolean
}

function StatItem({ label, value, sub, highlight }: StatItemProps) {
  return (
    <div className="flex flex-col gap-0.5 px-4 py-3 flex-1 min-w-0">
      <p className="text-[10px] font-semibold tracking-widest text-muted-foreground uppercase">{label}</p>
      <p className={cn('text-2xl font-black tabular-nums leading-none', highlight && 'text-emerald-500')}>{value}</p>
      {sub && <p className="text-xs text-muted-foreground">{sub}</p>}
    </div>
  )
}

interface Props {
  cubes: Cube[]
  algorithmsLearned?: number
}

export function ProfileStatsBar({ cubes, algorithmsLearned = 0 }: Props) {
  const t = useTranslations('Index.PeoplePage.stats')

  const uniqueSolves = useMemo(() => {
    const seen = new Set<string>()
    const unique: Solve[] = []
    for (const cube of cubes) {
      for (const solve of [...cube.solves.all, ...cube.solves.session]) {
        if (!seen.has(solve.id) && !solve.isDeleted) {
          seen.add(solve.id)
          unique.push(solve)
        }
      }
    }
    return unique
  }, [cubes])

  const favoriteEvent = useMemo(() => {
    const countByCategory: Record<string, number> = {}
    for (const cube of cubes) {
      const total =
        cube.solves.all.filter((s) => !s.isDeleted).length + cube.solves.session.filter((s) => !s.isDeleted).length
      if (total > 0) {
        countByCategory[cube.category] = (countByCategory[cube.category] ?? 0) + total
      }
    }
    const entries = Object.entries(countByCategory)
    if (entries.length === 0) return '--'
    return entries.reduce((best, curr) => (curr[1] > best[1] ? curr : best))[0]
  }, [cubes])

  const totalTimeMs = useMemo(() => uniqueSolves.reduce((sum, s) => sum + s.time, 0), [uniqueSolves])

  const formatTotalTime = (ms: number) => {
    if (ms === 0) return '—'
    return prettyMilliseconds(ms, { colonNotation: true, secondsDecimalDigits: 0 })
  }

  return (
    <div className="w-full border-b border-border/40 bg-muted/20 grid grid-cols-2 sm:flex sm:divide-x sm:divide-border/40 divide-y divide-border/40 sm:divide-y-0 [&>*:nth-child(odd)]:border-r [&>*:nth-child(odd)]:border-border/40 sm:[&>*:nth-child(odd)]:border-r-0">
      <StatItem label={t('favorite')} value={favoriteEvent} />
      <StatItem label={t('time-on-timer')} value={formatTotalTime(totalTimeMs)} sub={t('lifetime')} />
      <StatItem label={t('total-solves')} value={uniqueSolves.length > 0 ? String(uniqueSolves.length) : '--'} />
      <StatItem label={t('algorithms')} value={algorithmsLearned > 0 ? String(algorithmsLearned) : '--'} />
    </div>
  )
}
