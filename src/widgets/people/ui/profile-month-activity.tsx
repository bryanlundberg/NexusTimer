'use client'

import { useMemo, useState } from 'react'
import { useLocale, useTranslations } from 'next-intl'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/shared/lib/utils'
import { activityLevel, firstDayOfWeek } from '@/widgets/sidebar/lib/monthActivity'
import {
  compareMonths,
  firstActiveMonth,
  monthCounts,
  monthWeeks,
  shiftMonth,
  zonedToday
} from '@/widgets/people/lib/dailyActivity'

const LEVEL_CLASS = ['bg-muted-foreground/15', 'bg-primary/30', 'bg-primary/55', 'bg-primary/80', 'bg-primary'] as const

const NAV_BUTTON =
  'grid size-5 place-items-center text-muted-foreground outline-none transition-colors hover:text-foreground focus-visible:text-foreground focus-visible:ring-2 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-30'

const SUNDAY = new Date(2024, 0, 7)

interface Props {
  dailySolves: Record<string, number>
  timezone: string
  className?: string
}

export function ProfileMonthActivity({ dailySolves, timezone, className }: Props) {
  const locale = useLocale()
  const t = useTranslations('Index')
  const today = useMemo(() => zonedToday(timezone), [timezone])
  const [viewed, setViewed] = useState(() => ({ year: today.year, month: today.month }))
  const earliest = useMemo(() => firstActiveMonth(dailySolves), [dailySolves])
  const counts = useMemo(() => monthCounts(dailySolves, viewed), [dailySolves, viewed])

  const { monthLabel, weekdays, weeks, dayFormat } = useMemo(() => {
    const weekStart = firstDayOfWeek(locale)
    const weekdayFormat = new Intl.DateTimeFormat(locale, { weekday: 'narrow' })
    return {
      monthLabel: new Intl.DateTimeFormat(locale, {
        month: 'long',
        ...(viewed.year !== today.year ? { year: 'numeric' as const } : {})
      }).format(new Date(viewed.year, viewed.month)),
      weekdays: Array.from({ length: 7 }, (_, i) =>
        weekdayFormat.format(
          new Date(SUNDAY.getFullYear(), SUNDAY.getMonth(), SUNDAY.getDate() + ((weekStart + i) % 7))
        )
      ),
      weeks: monthWeeks(viewed, weekStart),
      dayFormat: new Intl.DateTimeFormat(locale, { month: 'short', day: 'numeric' })
    }
  }, [locale, viewed, today.year])

  const isCurrentMonth = compareMonths(viewed, { year: today.year, month: today.month }) === 0
  const canGoBack = earliest !== null && compareMonths(viewed, earliest) > 0

  return (
    <div className={cn('flex w-fit flex-col gap-2.5', className)}>
      <div className="flex items-center justify-between gap-3">
        <span className="font-display text-[10px] leading-none font-semibold tracking-[0.14em] uppercase">
          {monthLabel}
        </span>
        <div className="-mr-1 flex items-center">
          <button
            type="button"
            aria-label={t('PeoplePage.activity.previous-month')}
            title={t('PeoplePage.activity.previous-month')}
            disabled={!canGoBack}
            onClick={() => setViewed((month) => shiftMonth(month, -1))}
            className={NAV_BUTTON}
          >
            <ChevronLeft className="size-3.5" />
          </button>
          <button
            type="button"
            aria-label={t('PeoplePage.activity.next-month')}
            title={t('PeoplePage.activity.next-month')}
            disabled={isCurrentMonth}
            onClick={() => setViewed((month) => shiftMonth(month, 1))}
            className={NAV_BUTTON}
          >
            <ChevronRight className="size-3.5" />
          </button>
        </div>
      </div>

      <div role="group" aria-label={t('NavMain.activity-calendar')} className="flex gap-[3px]">
        <div aria-hidden className="mr-0.5 grid grid-rows-7 gap-[3px]">
          {weekdays.map((weekday, i) => (
            <span key={i} className="flex h-4 items-center text-[8px] leading-none text-muted-foreground/60 uppercase">
              {weekday}
            </span>
          ))}
        </div>
        {weeks.map((week, w) => (
          <div key={w} className="grid grid-rows-7 gap-[3px]">
            {week.map((day, i) => {
              if (day === null) return <span key={i} aria-hidden className="size-4" />
              const count = counts[day - 1] ?? 0
              const label = `${dayFormat.format(new Date(viewed.year, viewed.month, day))}: ${t('NavMain.activity-solves', { count })}`
              return (
                <span
                  key={i}
                  role="img"
                  aria-label={label}
                  title={label}
                  className={cn(
                    'size-4',
                    isCurrentMonth && day > today.day ? 'bg-muted-foreground/5' : LEVEL_CLASS[activityLevel(count)],
                    isCurrentMonth && day === today.day && 'outline outline-1 outline-offset-1 outline-primary/60'
                  )}
                />
              )
            })}
          </div>
        ))}
      </div>
    </div>
  )
}
