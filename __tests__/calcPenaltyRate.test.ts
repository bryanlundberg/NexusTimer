import calcPenaltyRate from '@/shared/lib/statistics/calcPenaltyRate'
import { makeSolve, makeSolves } from './fixtures/solve'

describe('calcPenaltyRate', () => {
  it('returns 0 for an empty array', () => {
    expect(calcPenaltyRate([])).toBe(0)
  })

  it('returns 0 for a nullish input', () => {
    expect(calcPenaltyRate(null as never)).toBe(0)
    expect(calcPenaltyRate(undefined as never)).toBe(0)
  })

  it('returns 0 when no solves have penalties', () => {
    expect(calcPenaltyRate(makeSolves([1000, 2000, 3000]))).toBe(0)
  })

  it('counts solves with plus2', () => {
    const solves = [
      makeSolve({ time: 1000 }),
      makeSolve({ time: 2000, plus2: true }),
      makeSolve({ time: 3000, plus2: true })
    ]
    expect(calcPenaltyRate(solves)).toBe(2)
  })

  it('counts solves with dnf', () => {
    const solves = [
      makeSolve({ time: 1000 }),
      makeSolve({ time: 2000, dnf: true }),
      makeSolve({ time: 3000, dnf: true })
    ]
    expect(calcPenaltyRate(solves)).toBe(2)
  })

  it('counts a solve with both plus2 and dnf only once', () => {
    const solves = [makeSolve({ time: 1000, plus2: true, dnf: true })]
    expect(calcPenaltyRate(solves)).toBe(1)
  })

  it('returns the total number of penalised solves across mixed types', () => {
    const solves = [
      makeSolve({ time: 1000 }),
      makeSolve({ time: 2000, plus2: true }),
      makeSolve({ time: 3000, dnf: true }),
      makeSolve({ time: 4000 }),
      makeSolve({ time: 5000, plus2: true, dnf: true })
    ]
    expect(calcPenaltyRate(solves)).toBe(3)
  })
})
