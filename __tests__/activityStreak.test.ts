import { activityStreak } from '@/widgets/sidebar/lib/activityStreak'
import { makeCube } from './fixtures/cube'
import { makeSolve } from './fixtures/solve'

const NOW = new Date(2026, 9, 11, 18, 30)

const at = (daysAgo: number, hour = 10) =>
  new Date(NOW.getFullYear(), NOW.getMonth(), NOW.getDate() - daysAgo, hour).getTime()

const cubeWith = (daysAgo: number[]) => makeCube({ sessionSolves: daysAgo.map((d) => makeSolve({ endTime: at(d) })) })

describe('activityStreak', () => {
  it('counts consecutive days ending today', () => {
    expect(activityStreak([cubeWith([0, 1, 2, 4])], NOW).streak).toBe(3)
  })

  it("keeps yesterday's streak alive before the first solve of the day", () => {
    expect(activityStreak([cubeWith([1, 2, 3])], NOW).streak).toBe(3)
  })

  it('drops to zero after a missed day', () => {
    expect(activityStreak([cubeWith([2, 3])], NOW).streak).toBe(0)
  })

  it('merges days across cubes and ignores deleted solves', () => {
    const deleted = makeCube({ allSolves: [makeSolve({ endTime: at(1), isDeleted: true })] })
    expect(activityStreak([cubeWith([0]), deleted, cubeWith([2])], NOW).streak).toBe(1)
    expect(activityStreak([cubeWith([0]), cubeWith([1])], NOW).streak).toBe(2)
  })

  it('marks the last seven days, oldest first', () => {
    const { lastWeek } = activityStreak([cubeWith([0, 2, 6, 9])], NOW)
    expect(lastWeek).toEqual([true, false, false, false, true, false, true])
  })

  it('treats a late night solve as its own local day', () => {
    const late = makeCube({ sessionSolves: [makeSolve({ endTime: at(1, 23) }), makeSolve({ endTime: at(0, 0) })] })
    expect(activityStreak([late], NOW).streak).toBe(2)
  })

  it('handles no cubes', () => {
    expect(activityStreak(null, NOW)).toEqual({ streak: 0, lastWeek: Array(7).fill(false) })
  })
})
