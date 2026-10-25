import {
  buildDistribution,
  findRecords,
  categoryBreakdown,
  monthlySeries,
  summarizeSolves
} from '@/widgets/page-aside/lib/asideStats'
import { makeSolve, makeSolves } from './fixtures/solve'
import { makeCube } from './fixtures/cube'

const NOW = new Date(2026, 9, 24, 12).getTime()
const daysAgo = (days: number) => new Date(2026, 9, 24 - days, 10).getTime()

describe('summarizeSolves', () => {
  it('ignores DNFs for mean, best and worst but counts them', () => {
    const solves = [
      makeSolve({ time: 1000 }),
      makeSolve({ time: 3000, plus2: true }),
      makeSolve({ time: 500, dnf: true })
    ]
    expect(summarizeSolves(solves)).toEqual({ count: 3, mean: 2000, best: 1000, worst: 3000, dnf: 1, plus2: 1 })
  })

  it('returns nulls when every solve is a DNF', () => {
    const summary = summarizeSolves([makeSolve({ dnf: true })])
    expect(summary.mean).toBeNull()
    expect(summary.best).toBeNull()
  })
})

describe('buildDistribution', () => {
  it('returns null below the minimum solve count', () => {
    expect(buildDistribution(makeSolves([1000, 2000, 3000]))).toBeNull()
  })

  it('puts every valid solve in a bin', () => {
    const distribution = buildDistribution(makeSolves([1000, 2000, 3000, 4000, 5000, 6000]), 4)!
    expect(distribution.bins.reduce((sum, count) => sum + count, 0)).toBe(6)
    expect(distribution.min).toBe(1000)
    expect(distribution.max).toBe(6000)
  })

  it('handles identical times', () => {
    const distribution = buildDistribution(makeSolves([2000, 2000, 2000, 2000, 2000]), 4)!
    expect(distribution.bins).toEqual([0, 0, 5, 0])
  })
})

describe('findRecords', () => {
  it('returns the best single with its solve and skips sizes without enough solves', () => {
    const best = makeSolve({ time: 900, endTime: daysAgo(2) })
    const solves = [makeSolve({ time: 1500, endTime: daysAgo(1) }), best, ...makeSolves([2000, 2100, 2200])]
    const records = findRecords(solves)
    expect(records.map((record) => record.size)).toEqual([1, 5])
    expect(records[0].solve).toBe(best)
    expect(records[0].at).toBe(daysAgo(2))
  })
})

describe('monthlySeries', () => {
  it('averages valid solves per month over the last six months, oldest first', () => {
    const solves = [
      makeSolve({ time: 1000, endTime: daysAgo(1) }),
      makeSolve({ time: 3000, endTime: daysAgo(2) }),
      makeSolve({ time: 4000, endTime: daysAgo(30) }),
      makeSolve({ time: 100, endTime: daysAgo(3), dnf: true }),
      makeSolve({ time: 9000, endTime: daysAgo(90) }),
      makeSolve({ time: 7000, endTime: daysAgo(400) })
    ]
    const series = monthlySeries(solves, NOW)
    expect(series).toHaveLength(6)
    expect(series[0].start).toBe(new Date(2026, 4, 1).getTime())
    expect(series.map((month) => month.mean)).toEqual([null, null, 9000, null, 4000, 2000])
    expect(series[5].count).toBe(2)
  })
})

describe('findRecords windows', () => {
  it('keeps the best window for averages and none for the single', () => {
    const records = findRecords(makeSolves([1000, 2000, 3000, 4000, 5000]))
    expect(records[0].window).toBeNull()
    expect(records[1].window).toHaveLength(5)
  })
})

describe('categoryBreakdown', () => {
  it('sums live solves per category, skipping deleted cubes, largest first', () => {
    const shares = categoryBreakdown([
      makeCube({ category: '2x2', allSolves: makeSolves([1000]) }),
      makeCube({ category: '3x3', allSolves: makeSolves([1000, 2000]), sessionSolves: makeSolves([3000]) }),
      makeCube({ category: '2x2', sessionSolves: makeSolves([1000]) }),
      makeCube({ category: '4x4', isDeleted: true, allSolves: makeSolves([1000, 1000, 1000, 1000]) })
    ])
    expect(shares).toEqual([
      { category: '3x3', count: 3 },
      { category: '2x2', count: 2 }
    ])
  })
})
