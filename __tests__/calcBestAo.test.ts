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
    it('returns the mean of three solves', () => {
      expect(calcBestAo(makeSolves([1000, 2000, 3000]), 3)).toBe(2000)
    })
  })

  describe('ao=5 (single window)', () => {
    it('returns the mean of 5 solves', () => {
      // mean of [1,2,3,4,5]*1000 → 3000
      expect(calcBestAo(makeSolves([1000, 2000, 3000, 4000, 5000]), 5)).toBe(3000)
    })
  })

  describe('multiple windows', () => {
    it('picks the window with the lowest mean', () => {
      // Window A: [3000, 4000, 5000, 6000, 7000] → 5000
      // Window B: [4000, 5000, 6000, 7000, 1000] → 4600
      // Window C: [5000, 6000, 7000, 1000, 2000] → 4200
      const result = calcBestAo(makeSolves([3000, 4000, 5000, 6000, 7000, 1000, 2000]), 5)
      expect(result).toBe(4200)
    })

    it('does not depend on input order beyond consecutive windows', () => {
      // The function only inspects consecutive windows; reordering shifts which window wins
      const ordered = calcBestAo(makeSolves([1000, 2000, 3000, 4000, 5000, 9999, 9999]), 5)
      expect(ordered).toBe(3000)
    })
  })

  describe('DNF handling', () => {
    it('tolerates one DNF per ao5 window, averaging the rest', () => {
      const solves = [
        makeSolve({ time: 1000, dnf: true }),
        makeSolve({ time: 2000 }),
        makeSolve({ time: 3000 }),
        makeSolve({ time: 4000 }),
        makeSolve({ time: 5000 }),
        makeSolve({ time: 6000 }),
        makeSolve({ time: 7000 })
      ]
      // Window [0..4]: 1 DNF tolerated → mean of [2000,3000,4000,5000] = 3500
      // Window [1..5]: [2000,3000,4000,5000,6000] → 4000
      // Window [2..6]: [3000,4000,5000,6000,7000] → 5000
      expect(calcBestAo(solves, 5)).toBe(3500)
    })

    it('returns Infinity when every window exceeds the DNF tolerance', () => {
      const solves = [
        makeSolve({ time: 1000, dnf: true }),
        makeSolve({ time: 2000, dnf: true }),
        makeSolve({ time: 3000 }),
        makeSolve({ time: 4000 }),
        makeSolve({ time: 5000 })
      ]
      // The single ao5 window has 2 DNFs > tolerance (1) → skipped → never updated
      expect(calcBestAo(solves, 5)).toBe(Infinity)
    })
  })
})
