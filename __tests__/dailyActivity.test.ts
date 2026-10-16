import {
  compareMonths,
  firstActiveMonth,
  monthCounts,
  monthWeeks,
  shiftMonth,
  zonedToday
} from '@/widgets/people/lib/dailyActivity'

describe('dailyActivity', () => {
  const daily = { '2026-09-30': 4, '2026-10-01': 2, '2026-10-15': 7, '2025-12-31': 0, '2026-02-03': 1 }

  it('lays out every day of the month with its count', () => {
    const october = monthCounts(daily, { year: 2026, month: 9 })

    expect(october).toHaveLength(31)
    expect(october[0]).toBe(2)
    expect(october[14]).toBe(7)
    expect(october.reduce((sum, count) => sum + count, 0)).toBe(9)
  })

  it('handles february in leap and common years', () => {
    expect(monthCounts({}, { year: 2028, month: 1 })).toHaveLength(29)
    expect(monthCounts({}, { year: 2026, month: 1 })).toHaveLength(28)
  })

  it('starts the history at the first month with solves', () => {
    expect(firstActiveMonth(daily)).toEqual({ year: 2026, month: 1 })
    expect(firstActiveMonth({})).toBeNull()
  })

  it('moves across years when shifting months', () => {
    expect(shiftMonth({ year: 2026, month: 0 }, -1)).toEqual({ year: 2025, month: 11 })
    expect(shiftMonth({ year: 2025, month: 11 }, 1)).toEqual({ year: 2026, month: 0 })
    expect(compareMonths({ year: 2026, month: 0 }, { year: 2025, month: 11 })).toBeGreaterThan(0)
  })

  it('splits the month into week columns that start on the locale week start', () => {
    const mondayFirst = monthWeeks({ year: 2026, month: 9 }, 1)

    expect(mondayFirst).toHaveLength(5)
    expect(mondayFirst[0]).toEqual([null, null, null, 1, 2, 3, 4])
    expect(mondayFirst[4]).toEqual([26, 27, 28, 29, 30, 31, null])

    const sundayFirst = monthWeeks({ year: 2026, month: 9 }, 0)
    expect(sundayFirst[0]).toEqual([null, null, null, null, 1, 2, 3])
    expect(sundayFirst.flat().filter((day) => day !== null)).toHaveLength(31)
  })

  it('reads today in the timezone of the profile', () => {
    const now = new Date(Date.UTC(2026, 9, 15, 23, 30))

    expect(zonedToday('UTC', now)).toEqual({ year: 2026, month: 9, day: 15 })
    expect(zonedToday('Asia/Tokyo', now)).toEqual({ year: 2026, month: 9, day: 16 })
  })
})
