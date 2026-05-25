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

  describe('ao=3 (returns the middle time after trimming best and worst)', () => {
    it('returns the middle time of three solves', () => {
      const solves = makeSolves([1000, 2000, 3000])
      expect(calcCurrentAo(solves, 3)).toBe(2000)
    })

    it('does not depend on input order', () => {
      const solves = makeSolves([3000, 1000, 2000])
      expect(calcCurrentAo(solves, 3)).toBe(2000)
    })
  })

  describe('ao=5 (average of the middle three after trimming best and worst)', () => {
    it('computes ao5 for the first 5 solves of FAKE_SESSION', () => {
      // times = [14553, 13718, 11875, 14108, 15054]
      // trimmed = [13718, 14108, 14553] → mean = 14126.333...
      expect(calcCurrentAo(FAKE_SESSION.slice(0, 5), 5)).toBe(14126.333333333334)
    })

    it('uses the first ao solves when more are provided', () => {
      const head = calcCurrentAo(FAKE_SESSION.slice(0, 5), 5)
      const more = calcCurrentAo(FAKE_SESSION.slice(0, 7), 5)
      expect(more).toBe(head)
    })
  })

  describe('DNF handling', () => {
    it('treats a single DNF as the worst solve and trims it', () => {
      const solves = [
        makeSolve({ time: 1000 }),
        makeSolve({ time: 2000 }),
        makeSolve({ time: 3000 }),
        makeSolve({ time: 4000 }),
        makeSolve({ time: 99999, dnf: true })
      ]
      // best=1000, worst=DNF, middle three = [2000, 3000, 4000] → 3000
      expect(calcCurrentAo(solves, 5)).toBe(3000)
    })

    it('returns 0 when more than one DNF is present', () => {
      const solves = [
        makeSolve({ time: 1000 }),
        makeSolve({ time: 2000 }),
        makeSolve({ time: 3000 }),
        makeSolve({ time: 99999, dnf: true }),
        makeSolve({ time: 99999, dnf: true })
      ]
      expect(calcCurrentAo(solves, 5)).toBe(0)
    })
  })
})
