import { Cube } from '@/entities/cube/model/types'

export type MonthActivity = {
  year: number
  month: number
  today: number
  firstWeekday: number
  counts: number[]
  total: number
}

type WeekInfoLocale = Intl.Locale & {
  getWeekInfo?: () => { firstDay: number }
  weekInfo?: { firstDay: number }
}

export function monthActivity(cubes: Cube[] | null, now: Date = new Date()): MonthActivity {
  const year = now.getFullYear()
  const month = now.getMonth()
  const counts = new Array<number>(new Date(year, month + 1, 0).getDate()).fill(0)
  const seen = new Set<string>()

  for (const cube of cubes ?? []) {
    for (const solve of [...cube.solves.session, ...cube.solves.all]) {
      if (solve.isDeleted || !solve.endTime || seen.has(solve.id)) continue
      seen.add(solve.id)
      const date = new Date(solve.endTime)
      if (date.getFullYear() === year && date.getMonth() === month) counts[date.getDate() - 1]++
    }
  }

  return {
    year,
    month,
    today: now.getDate(),
    firstWeekday: new Date(year, month, 1).getDay(),
    counts,
    total: counts.reduce((sum, count) => sum + count, 0)
  }
}

export function activityLevel(count: number): number {
  if (count >= 50) return 4
  if (count >= 20) return 3
  if (count >= 5) return 2
  if (count >= 1) return 1
  return 0
}

export function firstDayOfWeek(locale: string): number {
  try {
    const info = new Intl.Locale(locale) as WeekInfoLocale
    return (info.getWeekInfo?.().firstDay ?? info.weekInfo?.firstDay ?? 7) % 7
  } catch {
    return 0
  }
}
