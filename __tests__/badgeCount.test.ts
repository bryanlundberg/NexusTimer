import { formatBadgeCount } from '@/shared/lib/badge-count'

describe('formatBadgeCount', () => {
  it.each([
    [1, '1'],
    [9, '9'],
    [99, '99'],
    [100, '+99'],
    [4521, '+99']
  ])('formats %i as %s', (count, expected) => {
    expect(formatBadgeCount(count)).toBe(expected)
  })
})
