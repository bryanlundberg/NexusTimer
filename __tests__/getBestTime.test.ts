import getBestTime from '@/shared/lib/statistics/getBestTime'
import { makeSolve, makeSolves } from './fixtures/solve'

describe('getBestTime', () => {
  it('returns 0 for an empty array', () => {
    expect(getBestTime({ solves: [] })).toBe(0)
  })

  it('returns the time of the single solve', () => {
    expect(getBestTime({ solves: makeSolves([1234]) })).toBe(1234)
  })

  it('returns the minimum time across solves', () => {
    expect(getBestTime({ solves: makeSolves([3000, 1500, 2000]) })).toBe(1500)
  })

  it('does not mutate the input array order', () => {
    const solves = makeSolves([3000, 1500, 2000])
    const snapshot = solves.map((s) => s.time)
    getBestTime({ solves })
    expect(solves.map((s) => s.time)).toEqual(snapshot)
  })

  it('throws when a solve has a non-numeric time', () => {
    const bad = [makeSolve({ time: 1000 }), makeSolve({ time: 'oops' as unknown as number })]
    expect(() => getBestTime({ solves: bad })).toThrow(
      "Invalid solve data. Each solve object must have a 'time' property of type number."
    )
  })
})
