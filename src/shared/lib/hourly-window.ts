export const HOUR_MS = 60 * 60 * 1000

export interface HourlyWindow {
  startedAt: number
  nextRefreshAt: number
  secondsUntilNextRefresh: number
}

export function currentHourlyWindow(now: number = Date.now()): HourlyWindow {
  const startedAt = Math.floor(now / HOUR_MS) * HOUR_MS
  const nextRefreshAt = startedAt + HOUR_MS

  return {
    startedAt,
    nextRefreshAt,
    secondsUntilNextRefresh: Math.max(1, Math.ceil((nextRefreshAt - now) / 1000))
  }
}
