import getDeviation from '@/shared/lib/statistics/getDeviation'
import { FAKE_SESSION } from '../data/FAKE_SESSION'
import { makeSolves } from './fixtures/solve'

describe('getDeviation', () => {
  it('returns 0 for an empty array', () => {
    expect(getDeviation([])).toBe(0)
  })

  it('returns 0 for a nullish input', () => {
    expect(getDeviation(null as never)).toBe(0)
    expect(getDeviation(undefined as never)).toBe(0)
  })

  it('returns 0 when fewer than 2 solves', () => {
    expect(getDeviation(makeSolves([1000]))).toBe(0)
  })

  it('computes population standard deviation (divides by n)', () => {
    // [10, 20] → mean=15, variance=((10-15)^2+(20-15)^2)/2 = 25, stdev=5
    expect(getDeviation(makeSolves([10, 20]))).toBe(5)
  })

  it('handles uniform values with zero deviation', () => {
    expect(getDeviation(makeSolves([1000, 1000, 1000, 1000]))).toBe(0)
  })

  it('matches a known population dataset', () => {
    // [2, 4, 4, 4, 5, 5, 7, 9] → mean=5, population stdev=2
    expect(getDeviation(makeSolves([2, 4, 4, 4, 5, 5, 7, 9]))).toBe(2)
  })

  describe('FAKE_SESSION integration (population stdev)', () => {
    it('matches the known stdev of the full 52-solve session', () => {
      expect(getDeviation([...FAKE_SESSION])).toBe(1418.2807643598833)
    })

    it('matches the known stdev of the first 5 solves', () => {
      expect(getDeviation([...FAKE_SESSION].slice(0, 5))).toBe(1088.8310429079436)
    })

    it('matches the known stdev of the first 12 solves', () => {
      expect(getDeviation([...FAKE_SESSION].slice(0, 12))).toBe(1343.5132013576278)
    })

    it('matches the known stdev of the first 50 solves', () => {
      expect(getDeviation([...FAKE_SESSION].slice(0, 50))).toBe(1376.4910212565862)
    })
  })
})
