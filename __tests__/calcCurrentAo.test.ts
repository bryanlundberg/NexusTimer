import calcCurrentAo from '@/shared/lib/statistics/calcCurrentAo'
import { FAKE_SESSION } from '../data/FAKE_SESSION'
import { makeSolve, makeSolves } from './fixtures/solve'

describe('calcCurrentAo', () => {
  describe('edge cases', () => {
    it('returns 0 for an empty array', () => {
      expect(calcCurrentAo([], 5)).toBe(0)
    })

    it('returns 0 when solves are fewer than ao', () => {
      expect(calcCurrentAo(FAKE_SESSION.slice(0, 4), 5)).toBe(0)
    })

    it('returns 0 for ao <= 2', () => {
      expect(calcCurrentAo(FAKE_SESSION.slice(0, 5), 0)).toBe(0)
      expect(calcCurrentAo(FAKE_SESSION.slice(0, 5), 1)).toBe(0)
      expect(calcCurrentAo(FAKE_SESSION.slice(0, 5), 2)).toBe(0)
    })

    it('returns 0 for negative ao', () => {
      expect(calcCurrentAo(FAKE_SESSION.slice(0, 5), -3)).toBe(0)
    })
  })

  describe('ao=3 (mean of three solves)', () => {
    it('returns the mean of three solves', () => {
      const solves = makeSolves([1000, 2000, 3000])
      expect(calcCurrentAo(solves, 3)).toBe(2000)
    })

    it('does not depend on input order', () => {
      const solves = makeSolves([3000, 1000, 2000])
      expect(calcCurrentAo(solves, 3)).toBe(2000)
    })
  })

  describe('ao=5 (trimmed mean of five solves)', () => {
    it('computes ao5 for the first 5 solves of FAKE_SESSION', () => {
      expect(calcCurrentAo(FAKE_SESSION.slice(0, 5), 5)).toBeCloseTo(14126.33, 1)
    })

    it('uses the first ao solves when more are provided', () => {
      const head = calcCurrentAo(FAKE_SESSION.slice(0, 5), 5)
      const more = calcCurrentAo(FAKE_SESSION.slice(0, 7), 5)
      expect(more).toBe(head)
    })
  })

  describe('DNF handling', () => {
    it('tolerates one DNF in an ao5 (DNF is trimmed as the worst)', () => {
      const solves = [
        makeSolve({ time: 1000 }),
        makeSolve({ time: 2000 }),
        makeSolve({ time: 3000 }),
        makeSolve({ time: 4000 }),
        makeSolve({ time: 99999, dnf: true })
      ]

      expect(calcCurrentAo(solves, 5)).toBe(3000)
    })

    it('returns 0 (DNF) when an ao5 has more DNFs than tolerated', () => {
      const solves = [
        makeSolve({ time: 1000 }),
        makeSolve({ time: 2000 }),
        makeSolve({ time: 3000 }),
        makeSolve({ time: 4000, dnf: true }),
        makeSolve({ time: 99999, dnf: true })
      ]
      // ao5 tolerates only 1 DNF, here there are 2 → DNF
      expect(calcCurrentAo(solves, 5)).toBe(0)
    })

    it('returns 0 (DNF) for an ao3 with any DNF (tolerance 0)', () => {
      const solves = [makeSolve({ time: 1000 }), makeSolve({ time: 2000 }), makeSolve({ time: 3000, dnf: true })]
      expect(calcCurrentAo(solves, 3)).toBe(0)
    })

    it('returns the mean when no DNF is present', () => {
      const solves = makeSolves([1000, 2000, 3000, 4000, 5000])
      expect(calcCurrentAo(solves, 5)).toBe(3000)
    })
  })
})
