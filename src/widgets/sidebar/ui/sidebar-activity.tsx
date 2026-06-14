'use client'

import { useMemo } from 'react'
import { useLocale, useTranslations } from 'next-intl'
import { useTimerStore } from '@/shared/model/timer/useTimerStore'

const INTENSITY = [
  'bg-sidebar-accent/40',
  'bg-cube-green/30',
  'bg-cube-green/55',
  'bg-cube-green/80',
  'bg-cube-green'
] as const

function intensityLevel(count: number): number {
  if (count <= 0) return 0
  if (count <= 2) return 1
  if (count <= 5) return 2
  if (count <= 9) return 3
  return 4
}

export function SidebarActivity() {
  const locale = useLocale()
  const t = useTranslations('Index')
  const cubes = useTimerStore((store) => store.cubes)

  const { cells, total, monthLabel, weekdayLabels } = useMemo(() => {
    const now = new Date()
    const year = now.getFullYear()
    const month = now.getMonth()
    const daysInMonth = new Date(year, month + 1, 0).getDate()
    // Monday-first offset (getDay: 0=Sun..6=Sat)
    const firstWeekday = (new Date(year, month, 1).getDay() + 6) % 7
    const todayDate = now.getDate()

    const counts = new Array(daysInMonth + 1).fill(0)
    let total = 0

    for (const cube of cubes ?? []) {
      const allSolves = [...(cube.solves?.session ?? []), ...(cube.solves?.all ?? [])]
      for (const solve of allSolves) {
        const ts = solve.endTime
        if (!ts) continue
        const d = new Date(ts)
        if (d.getFullYear() === year && d.getMonth() === month) {
          counts[d.getDate()]++
          total++
        }
      }
    }

    const dateFmt = new Intl.DateTimeFormat(locale, { day: 'numeric', month: 'short', year: 'numeric' })

    const cells: Array<{ day: number | null; count: number; isToday: boolean; label: string }> = []
    for (let i = 0; i < firstWeekday; i++) cells.push({ day: null, count: 0, isToday: false, label: '' })
    for (let day = 1; day <= daysInMonth; day++) {
      const label = `${dateFmt.format(new Date(year, month, day))} - ${counts[day]}`
      cells.push({ day, count: counts[day], isToday: day === todayDate, label })
    }

    const monthLabel = new Intl.DateTimeFormat(locale, { month: 'long' }).format(now)
    const weekdayLabels = Array.from({ length: 7 }, (_, i) =>
      // 2024-01-01 is a Monday
      new Intl.DateTimeFormat(locale, { weekday: 'narrow' }).format(new Date(2024, 0, 1 + i))
    )

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
            <span key={i} className="aspect-square" />
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
