import { currentHourlyWindow, HOUR_MS } from '@/shared/lib/hourly-window'

const at = (iso: string) => Date.parse(iso)

describe('currentHourlyWindow', () => {
  it('pins every visit inside the hour to the same window', () => {
    const early = currentHourlyWindow(at('2026-09-17T06:00:03Z'))
    const late = currentHourlyWindow(at('2026-09-17T06:59:58Z'))

    expect(early.startedAt).toBe(late.startedAt)
    expect(early.nextRefreshAt).toBe(late.nextRefreshAt)
    expect(new Date(late.nextRefreshAt).toISOString()).toBe('2026-09-17T07:00:00.000Z')
  })

  it('moves to the next window once the hour turns', () => {
    const before = currentHourlyWindow(at('2026-09-17T06:59:59Z'))
    const after = currentHourlyWindow(at('2026-09-17T07:00:00Z'))

    expect(after.startedAt).toBe(before.nextRefreshAt)
    expect(after.nextRefreshAt - after.startedAt).toBe(HOUR_MS)
  })

  it('counts the seconds left to the top of the hour', () => {
    expect(currentHourlyWindow(at('2026-09-17T06:30:00Z')).secondsUntilNextRefresh).toBe(1800)
    expect(currentHourlyWindow(at('2026-09-17T06:00:00Z')).secondsUntilNextRefresh).toBe(3600)
  })

  it('never hands back a zero ttl on the last fraction of a second', () => {
    expect(currentHourlyWindow(at('2026-09-17T06:59:59.999Z')).secondsUntilNextRefresh).toBe(1)
  })
})
