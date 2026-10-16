import { createDateKey, isValidTimezone } from '@nexustimer/stats'

export type CalendarMonth = { year: number; month: number }

export type CalendarDay = CalendarMonth & { day: number }

const pad = (value: number) => String(value).padStart(2, '0')

function parseDay(key: string): CalendarDay | null {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(key)
  if (!match) return null
  return { year: Number(match[1]), month: Number(match[2]) - 1, day: Number(match[3]) }
}

export function zonedToday(timezone: string, now: Date = new Date()): CalendarDay {
  const key = createDateKey(isValidTimezone(timezone) ? timezone : undefined)(now.getTime())
  return parseDay(key) ?? { year: now.getFullYear(), month: now.getMonth(), day: now.getDate() }
}

export function monthCounts(dailySolves: Record<string, number>, { year, month }: CalendarMonth): number[] {
  const prefix = `${year}-${pad(month + 1)}-`
  const days = new Date(year, month + 1, 0).getDate()
  return Array.from({ length: days }, (_, i) => dailySolves[`${prefix}${pad(i + 1)}`] ?? 0)
}

export function monthWeeks({ year, month }: CalendarMonth, weekStart: number): (number | null)[][] {
  const days = new Date(year, month + 1, 0).getDate()
  const offset = (new Date(year, month, 1).getDay() - weekStart + 7) % 7
  const weeks: (number | null)[][] = []

  for (let start = -offset; start < days; start += 7) {
    weeks.push(
      Array.from({ length: 7 }, (_, i) => {
        const day = start + i + 1
        return day >= 1 && day <= days ? day : null
      })
    )
  }

  return weeks
}

export function firstActiveMonth(dailySolves: Record<string, number>): CalendarMonth | null {
  let earliest: CalendarDay | null = null
  for (const [key, count] of Object.entries(dailySolves)) {
    const day = count > 0 ? parseDay(key) : null
    if (day && (!earliest || compareMonths(day, earliest) < 0)) earliest = day
  }
  return earliest && { year: earliest.year, month: earliest.month }
}

export function shiftMonth({ year, month }: CalendarMonth, delta: number): CalendarMonth {
  const date = new Date(year, month + delta, 1)
  return { year: date.getFullYear(), month: date.getMonth() }
}

export function compareMonths(a: CalendarMonth, b: CalendarMonth): number {
  return a.year - b.year || a.month - b.month
}
