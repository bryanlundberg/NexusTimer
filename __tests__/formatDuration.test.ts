import { formatDuration, formatDurationClock } from '@/shared/lib/formatDuration'

describe('formatDuration', () => {
  it.each([
    [0, '0ms'],
    [0.4, '1ms'],
    [1, '1ms'],
    [999, '999ms'],
    [999.6, '999ms'],
    [1000, '1s'],
    [1050, '1s'],
    [1099, '1s'],
    [59950, '59.9s'],
    [60000, '1m'],
    [60050, '1m'],
    [125500, '2m 5.5s'],
    [3600000, '1h'],
    [3723400, '1h 2m 3.4s'],
    [86400000, '1d'],
    [90061000, '1d 1h 1m 1s'],
    [31536000000, '1y'],
    [31626061500, '1y 1d 1h 1m 1.5s']
  ])('formats %d ms as %s', (ms, expected) => {
    expect(formatDuration(ms)).toBe(expected)
  })
})

describe('formatDurationClock', () => {
  it.each([
    [0, '0:00'],
    [999, '0:00'],
    [1000, '0:01'],
    [5000, '0:05'],
    [59999, '0:59'],
    [60000, '1:00'],
    [125500, '2:05'],
    [3600000, '1:00:00'],
    [3723000, '1:02:03'],
    [86400000, '1:00:00:00'],
    [90061000, '1:01:01:01'],
    [31536000000, '1:00:00:00:00']
  ])('formats %d ms as %s', (ms, expected) => {
    expect(formatDurationClock(ms)).toBe(expected)
  })
})
