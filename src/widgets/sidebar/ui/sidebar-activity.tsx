'use client'

import { useMemo } from 'react'
import { useLocale, useTranslations } from 'next-intl'
import { useTimerStore } from '@/shared/model/timer/useTimerStore'
import dayjs from '@/shared/lib/dayjs'

const INTENSITY = ['bg-muted-foreground/15', 'bg-primary/30', 'bg-primary/55', 'bg-primary/80', 'bg-primary'] as const

function intensityLevel(count: number): number {
  if (count >= 50) return 4
  if (count >= 20) return 3
  if (count >= 5) return 2
  if (count >= 1) return 1
  return 0
}

export function SidebarActivity() {
  const locale = useLocale()
  const t = useTranslations('Index')
  const cubes = useTimerStore((store) => store.cubes)

  const { cells, total, monthLabel, weekdayLabels } = useMemo(() => {
    const now = dayjs().locale(locale)
    const year = now.year()
    const month = now.month()
    const daysInMonth = now.daysInMonth()
    const firstWeekday = now.startOf('month').day()
    const todayDate = now.date()

    const counts = new Array(daysInMonth + 1).fill(0)
    let total = 0

    const seen = new Set<string>()
    for (const cube of cubes ?? []) {
      const allSolves = [...(cube.solves?.session ?? []), ...(cube.solves?.all ?? [])]
      for (const solve of allSolves) {
        if (!solve || solve.isDeleted) continue
        if (seen.has(solve.id)) continue
        seen.add(solve.id)
        const ts = solve.endTime
        if (!ts) continue
        const d = new Date(ts)
        if (d.getFullYear() === year && d.getMonth() === month) {
          counts[d.getDate()]++
          total++
        }
      }
    }

    const cells: Array<{ day: number | null; count: number; isToday: boolean; label: string }> = []
    for (let i = 0; i < firstWeekday; i++) cells.push({ day: null, count: 0, isToday: false, label: '' })
    for (let day = 1; day <= daysInMonth; day++) {
      const label = `${now.date(day).format('ll')} - ${counts[day]}`
      cells.push({ day, count: counts[day], isToday: day === todayDate, label })
    }
    while (cells.length % 7 !== 0) cells.push({ day: null, count: 0, isToday: false, label: '' })

    const monthLabel = now.format('MMMM')
    const weekdayLabels = Array.from({ length: 7 }, (_, i) => now.day(i).format('dd').charAt(0))

    return { cells, total, monthLabel, weekdayLabels }
  }, [cubes, locale])

  return (
    <div className="rounded-lg border bg-background/40 p-3">
      <div className="mb-2 flex items-center justify-between">
        <span className="text-[11px] font-semibold capitalize leading-none">{monthLabel}</span>
        <span className="text-[10px] tabular-nums text-muted-foreground leading-none">
          {total} {t('NavMain.activity-solves')}
        </span>
      </div>
      <div className="mb-1 grid grid-cols-7 gap-1">
        {weekdayLabels.map((w, i) => (
          <span key={i} className="text-center text-[8px] uppercase text-muted-foreground/60 leading-none">
            {w}
          </span>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {cells.map((cell, i) =>
          cell.day === null ? (
            <span
              key={i}
              aria-hidden
              className="aspect-square rounded-[3px] border border-dashed border-muted-foreground/15 bg-transparent"
            />
          ) : (
            <span
              key={i}
              title={cell.label}
              className={`aspect-square rounded-[3px] ${INTENSITY[intensityLevel(cell.count)]} ${
                cell.isToday ? 'ring-1 ring-primary ring-offset-1 ring-offset-sidebar' : ''
              }`}
            />
          )
        )}
      </div>
    </div>
  )
}
