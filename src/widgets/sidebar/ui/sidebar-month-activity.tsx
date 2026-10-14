'use client'

import { useMemo } from 'react'
import { useLocale, useTranslations } from 'next-intl'
import { useTimerStore } from '@/shared/model/timer/useTimerStore'
import { cn } from '@/shared/lib/utils'
import { activityLevel, firstDayOfWeek, monthActivity } from '@/widgets/sidebar/lib/monthActivity'

const LEVEL_CLASS = ['bg-muted-foreground/15', 'bg-primary/30', 'bg-primary/55', 'bg-primary/80', 'bg-primary'] as const

export function SidebarMonthActivity() {
  const locale = useLocale()
  const t = useTranslations('Index.NavMain')
  const cubes = useTimerStore((store) => store.cubes)
  const { year, month, today, firstWeekday, counts, total } = useMemo(() => monthActivity(cubes), [cubes])

  const { monthLabel, weekdays, weekStart, dayFormat } = useMemo(() => {
    const weekStart = firstDayOfWeek(locale)
    const weekdayFormat = new Intl.DateTimeFormat(locale, { weekday: 'narrow' })
    return {
      monthLabel: new Intl.DateTimeFormat(locale, { month: 'long' }).format(new Date(year, month)),
      weekdays: Array.from({ length: 7 }, (_, i) =>
        weekdayFormat.format(new Date(year, month, 1 + ((weekStart + i - firstWeekday + 7) % 7)))
      ),
      weekStart,
      dayFormat: new Intl.DateTimeFormat(locale, { month: 'short', day: 'numeric' })
    }
  }, [locale, year, month, firstWeekday])

  const offset = (firstWeekday - weekStart + 7) % 7

  return (
    <div>
      <div className="flex items-baseline justify-between gap-2">
        <span className="font-display text-[10px] leading-none font-semibold tracking-[0.14em] uppercase">
          {monthLabel}
        </span>
        <span className="text-[10px] leading-none text-muted-foreground tabular-nums">
          {t('activity-solves', { count: total })}
        </span>
      </div>
      <div aria-hidden className="mt-2.5 mb-1 grid grid-cols-7 gap-1">
        {weekdays.map((weekday, i) => (
          <span key={i} className="text-center text-[8px] leading-none text-muted-foreground/60 uppercase">
            {weekday}
          </span>
        ))}
      </div>
      <div role="group" aria-label={t('activity-calendar')} className="grid grid-cols-7 gap-1">
        {Array.from({ length: offset }, (_, i) => (
          <span key={`pad-${i}`} aria-hidden />
        ))}
        {counts.map((count, i) => {
          const day = i + 1
          const label = `${dayFormat.format(new Date(year, month, day))}: ${t('activity-solves', { count })}`
          return (
            <span
              key={day}
              role="img"
              aria-label={label}
              title={label}
              className={cn(
                'aspect-square',
                day > today ? 'bg-muted-foreground/5' : LEVEL_CLASS[activityLevel(count)],
                day === today && 'outline outline-1 outline-offset-1 outline-primary/60'
              )}
            />
          )
        })}
      </div>
    </div>
  )
}
