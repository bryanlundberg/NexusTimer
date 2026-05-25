import getWorstTime from '@/shared/lib/statistics/getWorstTime'
import { FAKE_SESSION } from '../data/FAKE_SESSION'
import { makeSolves } from './fixtures/solve'

describe('getWorstTime', () => {
  it('returns 0 for an empty array', () => {
    expect(getWorstTime([])).toBe(0)
  })

  it('returns the time of the single solve', () => {
    expect(getWorstTime(makeSolves([1234]))).toBe(1234)
  })

  it('returns the maximum time across solves', () => {
    expect(getWorstTime(makeSolves([3000, 1500, 2000]))).toBe(3000)
  })

  it('does not mutate the input array order', () => {
    const solves = makeSolves([3000, 1500, 2000])
    const snapshot = solves.map((s) => s.time)
    getWorstTime(solves)
    expect(solves.map((s) => s.time)).toEqual(snapshot)
  })

  describe('FAKE_SESSION integration', () => {
    it('returns the highest solve time from the full session', () => {
      expect(getWorstTime([...FAKE_SESSION])).toBe(16711)
    })
  })
})
