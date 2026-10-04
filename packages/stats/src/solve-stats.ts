import dayjs from 'dayjs'
import { createDateKey } from './date-key'
import { mergeSolvesNewestFirst } from './sort-solves'
import type { Cube, Solve } from './types'

export interface SolveStats {
  totalValid: number
  bestByCategory: Map<string, number>
  countByCategory: Map<string, number>
  totalTimeSpent: number
  newYearSolveCount: number
  replayCount: number
  max3x3SolvesPerCube: number
  maxSolvesInOneDay: number
  longestDateStreak: number
  longestCleanStreak: number
  bookmarkCount: number
  commentCount: number
}

export function computeSolveStats(cubes: Cube[], timezone?: string): SolveStats {
  const dateKey = createDateKey(timezone)
  const solvesByDate = new Map<string, number>()
  const bestByCategory = new Map<string, number>()
  const countByCategory = new Map<string, number>()

  let totalValid = 0
  let totalTimeSpent = 0
  let newYearSolveCount = 0
  let max3x3SolvesPerCube = 0
  const streakLists: Solve[][] = []
  let bookmarkCount = 0
  let commentCount = 0
  let replayCount = 0

  for (const cube of cubes) {
    let cube3x3Count = 0

    const combined = cube.solves.all.concat(cube.solves.session)
    streakLists.push(
      cube.solves.all.filter((solve) => !solve.isDeleted),
      cube.solves.session.filter((solve) => !solve.isDeleted)
    )

    for (let i = 0; i < combined.length; i++) {
      const solve = combined[i]!
      if (solve.isDeleted) continue

      if (solve.bookmark) bookmarkCount++
      if (solve.comment && solve.comment.trim().length > 0) commentCount++
      if (solve.replay) replayCount++

      // A DNF still cost the solver those minutes, so it counts as time spent.
      totalTimeSpent += solve.time

      if (!solve.dnf) {
        totalValid++
        if (cube.category === '3x3') cube3x3Count++

        countByCategory.set(cube.category, (countByCategory.get(cube.category) ?? 0) + 1)
        // Raw time a +2 penalty is deliberately not folded in here.
        if (solve.time < (bestByCategory.get(cube.category) ?? Infinity)) {
          bestByCategory.set(cube.category, solve.time)
        }

        const date = dateKey(solve.startTime)
        if (date.endsWith('-01-01')) newYearSolveCount++
        solvesByDate.set(date, (solvesByDate.get(date) ?? 0) + 1)
      }
    }

    if (cube3x3Count > max3x3SolvesPerCube) max3x3SolvesPerCube = cube3x3Count
  }

  let currentCleanStreak = 0
  let longestCleanStreak = 0
  for (const solve of mergeSolvesNewestFirst(streakLists)) {
    if (!solve.dnf && !solve.plus2) {
      currentCleanStreak++
      if (currentCleanStreak > longestCleanStreak) longestCleanStreak = currentCleanStreak
    } else {
      currentCleanStreak = 0
    }
  }

  let longestDateStreak = solvesByDate.size > 0 ? 1 : 0
  if (solvesByDate.size > 1) {
    const sortedDates = Array.from(solvesByDate.keys()).sort()
    let current = 1
    for (let i = 1; i < sortedDates.length; i++) {
      const prev = dayjs(sortedDates[i - 1])
      const curr = dayjs(sortedDates[i])
      if (curr.diff(prev, 'day') === 1) {
        current++
        if (current > longestDateStreak) longestDateStreak = current
      } else {
        current = 1
      }
    }
  }

  let maxSolvesInOneDay = 0
  solvesByDate.forEach((count) => {
    if (count > maxSolvesInOneDay) maxSolvesInOneDay = count
  })

  return {
    totalValid,
    bestByCategory,
    countByCategory,
    totalTimeSpent,
    newYearSolveCount,
    replayCount,
    max3x3SolvesPerCube,
    maxSolvesInOneDay,
    longestDateStreak,
    longestCleanStreak,
    bookmarkCount,
    commentCount
  }
}
