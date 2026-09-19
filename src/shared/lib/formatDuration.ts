const MS_PER_MINUTE = 60_000
const MS_PER_HOUR = 3_600_000
const MS_PER_DAY = 86_400_000

function splitLargeUnits(ms: number) {
  const days = Math.trunc(ms / MS_PER_DAY)
  return {
    years: Math.trunc(days / 365),
    days: days % 365,
    hours: Math.trunc(ms / MS_PER_HOUR) % 24,
    minutes: Math.trunc(ms / MS_PER_MINUTE) % 60
  }
}

function floorSeconds(ms: number, decimals: number): string {
  const factor = 10 ** decimals
  const seconds = (ms / 1000) % 60
  return (Math.floor(seconds * factor + 1e-7) / factor).toFixed(decimals)
}

/**
 * Human readable duration with unit suffixes, e.g. `1d 2h 3m 4.5s` or `850ms`. Zero units are omitted.
 */
export function formatDuration(ms: number): string {
  const { years, days, hours, minutes } = splitLargeUnits(ms)
  const parts: string[] = []

  for (const [value, unit] of [
    [years, 'y'],
    [days, 'd'],
    [hours, 'h'],
    [minutes, 'm']
  ] as const) {
    if (value !== 0) parts.push(`${value}${unit}`)
  }

  if (ms < 1000) {
    const rounded = Math.min(ms >= 1 ? Math.round(ms) : Math.ceil(ms), 999)
    if (rounded !== 0) parts.push(`${rounded}ms`)
  } else {
    const seconds = floorSeconds(ms, 1).replace(/\.0$/, '')
    if (seconds !== '0') parts.push(`${seconds}s`)
  }

  return parts.length > 0 ? parts.join(' ') : '0ms'
}

/**
 * Clock style duration in whole seconds, e.g. `1:02:03` or `0:05`. Leading zero units are omitted, minutes always shown.
 */
export function formatDurationClock(ms: number): string {
  const { years, days, hours, minutes } = splitLargeUnits(ms)
  const parts: string[] = []

  for (const [value, always] of [
    [years, false],
    [days, false],
    [hours, false],
    [minutes, true],
    [Number(floorSeconds(ms, 0)), true]
  ] as const) {
    if (parts.length === 0 && value === 0 && !always) continue
    parts.push(String(value).padStart(parts.length > 0 ? 2 : 1, '0'))
  }

  return parts.join(':')
}
