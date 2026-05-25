import calcBestAo from '@/shared/lib/statistics/calcBestAo'
import { makeSolve, makeSolves } from './fixtures/solve'

describe('calcBestAo', () => {
  describe('edge cases', () => {
    it('returns 0 for an empty array', () => {
      expect(calcBestAo([], 5)).toBe(0)
    })

    it('returns 0 when solves are fewer than ao', () => {
      expect(calcBestAo(makeSolves([1000, 2000, 3000]), 5)).toBe(0)
    })

    it('returns 0 for a nullish input', () => {
      expect(calcBestAo(null as never, 5)).toBe(0)
    })
  })

  describe('ao=3 (single window)', () => {
    it('returns the middle time after trimming best and worst', () => {
      expect(calcBestAo(makeSolves([1000, 2000, 3000]), 3)).toBe(2000)
    })
  })

  describe('ao=5 (single window)', () => {
    it('returns the trimmed mean of 5 solves', () => {
      // sorted=[1,2,3,4,5]*1000 → trim=[2000,3000,4000] → 3000
      expect(calcBestAo(makeSolves([1000, 2000, 3000, 4000, 5000]), 5)).toBe(3000)
    })
  })

  describe('multiple windows', () => {
    it('picks the window with the lowest trimmed mean', () => {
      // Window A (slow): [3000, 4000, 5000, 6000, 7000] → trim → 5000
      // Window B (mixed): [4000, 5000, 6000, 7000, 1000] → trim → 5000
      // Window C (fast):  [5000, 6000, 7000, 1000, 2000] → trim=[2000,5000,6000] → 4333.33
      const result = calcBestAo(makeSolves([3000, 4000, 5000, 6000, 7000, 1000, 2000]), 5)
      expect(result).toBeCloseTo(4333.333333, 4)
    })

    it('does not depend on input order beyond consecutive windows', () => {
      // The function only inspects consecutive windows; reordering shifts which window wins
      const ordered = calcBestAo(makeSolves([1000, 2000, 3000, 4000, 5000, 9999, 9999]), 5)
      expect(ordered).toBe(3000)
    })
  })

  describe('DNF handling', () => {
    it('treats a single DNF as the worst solve and still trims', () => {
      const solves = [
        makeSolve({ time: 1000 }),
        makeSolve({ time: 2000 }),
        makeSolve({ time: 3000 }),
        makeSolve({ time: 4000 }),
        makeSolve({ time: 99999, dnf: true })
      ]
      // sorted by time, DNF last: [1000,2000,3000,4000,DNF] → trim=[2000,3000,4000] → 3000
      expect(calcBestAo(solves, 5)).toBe(3000)
    })

    it('skips windows with more than one DNF', () => {
      const solves = [
        makeSolve({ time: 1000, dnf: true }),
        makeSolve({ time: 2000, dnf: true }),
        makeSolve({ time: 3000 }),
        makeSolve({ time: 4000 }),
        makeSolve({ time: 5000 }),
        makeSolve({ time: 6000 }),
        makeSolve({ time: 7000 })
      ]
      // Window [0..4] has 2 DNFs → skipped
      // Window [1..5] has 1 DNF → sorted [3000,4000,5000,6000,DNF] → trim=[4000,5000,6000] → 5000
      // Window [2..6] valid: [3000,4000,5000,6000,7000] → trim=[4000,5000,6000] → 5000
      expect(calcBestAo(solves, 5)).toBe(5000)
    })

    it('returns Infinity when every window has too many DNFs', () => {
      const solves = makeSolves([1000, 2000, 3000, 4000, 5000]).map((s) => ({ ...s, dnf: true }))
      // Every solve is DNF → window dnfCount=5 → always skipped → bestAo never updated
      expect(calcBestAo(solves, 5)).toBe(Infinity)
    })
  })
})
