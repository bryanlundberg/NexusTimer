import getMean from '@/shared/lib/statistics/getMean'
import { FAKE_SESSION } from '../data/FAKE_SESSION'
import { makeSolve, makeSolves } from './fixtures/solve'

describe('getMean', () => {
  it('returns 0 for an empty array', () => {
    expect(getMean([])).toBe(0)
  })

  it('returns 0 for a nullish input', () => {
    expect(getMean(null as never)).toBe(0)
    expect(getMean(undefined as never)).toBe(0)
  })

  it('returns the time of the single solve', () => {
    expect(getMean(makeSolves([1234]))).toBe(1234)
  })

  it('computes the arithmetic mean across solves', () => {
    expect(getMean(makeSolves([1000, 2000, 3000]))).toBe(2000)
    expect(getMean(makeSolves([1500, 2500]))).toBe(2000)
  })

  it('excludes DNF solves from the calculation', () => {
    const solves = [makeSolve({ time: 1000 }), makeSolve({ time: 2000 }), makeSolve({ time: 99999, dnf: true })]
    expect(getMean(solves)).toBe(1500)
  })

  it('returns 0 when every solve is a DNF', () => {
    const solves = [makeSolve({ time: 1000, dnf: true }), makeSolve({ time: 2000, dnf: true })]
    expect(getMean(solves)).toBe(0)
  })

  describe('FAKE_SESSION integration', () => {
    it('matches the known mean of the full 52-solve session', () => {
      expect(getMean([...FAKE_SESSION])).toBe(13658.98076923077)
    })

    it('matches the known mean of the first 5 solves', () => {
      expect(getMean([...FAKE_SESSION].slice(0, 5))).toBe(13861.6)
    })

    it('matches the known mean of the first 50 solves', () => {
      expect(getMean([...FAKE_SESSION].slice(0, 50))).toBe(13738.22)
    })
  })
})
