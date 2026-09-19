import dayjs from '@/shared/lib/dayjs'
import { createDateKey, isValidTimezone } from '@/shared/lib/dateKey'
import { computeSolveStats } from '@/entities/achievement/model/achievements'
import { makeCube } from './fixtures/cube'
import { makeSolve } from './fixtures/solve'

const NEW_YEAR_UTC_3AM = Date.UTC(2025, 0, 1, 3, 0, 0)

describe('createDateKey', () => {
  it('buckets by the given timezone', () => {
    expect(createDateKey('UTC')(NEW_YEAR_UTC_3AM)).toBe('2025-01-01')
    expect(createDateKey('America/Mexico_City')(NEW_YEAR_UTC_3AM)).toBe('2024-12-31')
    expect(createDateKey('Asia/Tokyo')(Date.UTC(2024, 11, 31, 16, 0, 0))).toBe('2025-01-01')
  })

  it('falls back to the runtime local zone without a timezone', () => {
    expect(createDateKey()(NEW_YEAR_UTC_3AM)).toBe(dayjs(NEW_YEAR_UTC_3AM).format('YYYY-MM-DD'))
  })
})

describe('isValidTimezone', () => {
  it('accepts IANA zones and rejects garbage', () => {
    expect(isValidTimezone('America/Mexico_City')).toBe(true)
    expect(isValidTimezone('UTC')).toBe(true)
    expect(isValidTimezone('Not/AZone')).toBe(false)
    expect(isValidTimezone('')).toBe(false)
  })
})

describe('computeSolveStats timezone', () => {
  const cubes = [makeCube({ allSolves: [makeSolve({ startTime: NEW_YEAR_UTC_3AM, endTime: NEW_YEAR_UTC_3AM })] })]

  it('counts a new year solve only where it is new year locally', () => {
    expect(computeSolveStats(cubes, 'UTC').newYearSolveCount).toBe(1)
    expect(computeSolveStats(cubes, 'America/Mexico_City').newYearSolveCount).toBe(0)
  })

  it('splits a streak across days using the given timezone', () => {
    const at = (iso: string) => {
      const ms = Date.parse(iso)
      return makeSolve({ startTime: ms, endTime: ms })
    }
    const solves = [at('2025-03-01T23:30:00Z'), at('2025-03-02T01:30:00Z')]
    const stats = (timezone: string) => computeSolveStats([makeCube({ allSolves: solves })], timezone)

    expect(stats('UTC').longestDateStreak).toBe(2)
    expect(stats('America/Mexico_City').longestDateStreak).toBe(1)
    expect(stats('America/Mexico_City').maxSolvesInOneDay).toBe(2)
  })
})
