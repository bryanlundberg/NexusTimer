import { activityLevel, monthActivity } from '@/widgets/sidebar/lib/monthActivity'
import { makeCube } from './fixtures/cube'
import { makeSolve } from './fixtures/solve'

const NOW = new Date(2026, 9, 14, 18, 30)

const on = (day: number, month = 9, year = 2026, hour = 10) =>
  makeSolve({ endTime: new Date(year, month, day, hour).getTime() })

describe('monthActivity', () => {
  it('counts solves per day of the current month', () => {
    const cube = makeCube({ sessionSolves: [on(1), on(1), on(14)], allSolves: [on(31, 9, 2026, 23)] })
    const { counts, total, today, firstWeekday } = monthActivity([cube], NOW)
    expect(counts).toHaveLength(31)
    expect(counts[0]).toBe(2)
    expect(counts[13]).toBe(1)
    expect(counts[30]).toBe(1)
    expect(total).toBe(4)
    expect(today).toBe(14)
    expect(firstWeekday).toBe(4)
  })

  it('ignores other months and years', () => {
    const cube = makeCube({ sessionSolves: [on(30, 8), on(1, 10), on(14, 9, 2025), on(2)] })
    expect(monthActivity([cube], NOW).total).toBe(1)
  })

  it('skips deleted, unfinished and duplicated solves', () => {
    const shared = on(3)
    const cube = makeCube({
      sessionSolves: [shared, makeSolve({ endTime: 0 }), { ...on(4), isDeleted: true }],
      allSolves: [shared]
    })
    expect(monthActivity([cube], NOW).counts.slice(0, 4)).toEqual([0, 0, 1, 0])
  })

  it('merges solves across cubes', () => {
    const cubes = [makeCube({ sessionSolves: [on(5)] }), makeCube({ allSolves: [on(5)] })]
    expect(monthActivity(cubes, NOW).counts[4]).toBe(2)
  })

  it('handles no cubes', () => {
    expect(monthActivity(null, NOW)).toMatchObject({ total: 0, counts: Array(31).fill(0) })
  })
})

describe('activityLevel', () => {
  it('buckets daily counts', () => {
    expect([0, 1, 4, 5, 19, 20, 49, 50, 300].map(activityLevel)).toEqual([0, 1, 1, 2, 2, 3, 3, 4, 4])
  })
})
