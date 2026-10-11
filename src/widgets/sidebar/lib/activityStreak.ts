import { Cube } from '@/entities/cube/model/types'

const DAY_MS = 24 * 60 * 60 * 1000

const dayKey = (date: Date) => date.getFullYear() * 10000 + date.getMonth() * 100 + date.getDate()

export function activityStreak(cubes: Cube[] | null, now: Date = new Date()): { streak: number; lastWeek: boolean[] } {
  const days = new Set<number>()
  for (const cube of cubes ?? []) {
    for (const solve of [...cube.solves.session, ...cube.solves.all]) {
      if (!solve.isDeleted && solve.endTime) days.add(dayKey(new Date(solve.endTime)))
    }
  }

  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 12)
  const dayBefore = (offset: number) => dayKey(new Date(today.getTime() - offset * DAY_MS))

  const lastWeek = Array.from({ length: 7 }, (_, i) => days.has(dayBefore(6 - i)))

  let offset = days.has(dayBefore(0)) ? 0 : 1
  let streak = 0
  while (days.has(dayBefore(offset))) {
    streak++
    offset++
  }

  return { streak, lastWeek }
}
