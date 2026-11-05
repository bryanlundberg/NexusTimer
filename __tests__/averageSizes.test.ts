import { toMerged } from 'es-toolkit'
import { defaultSettings } from '@/shared/model/settings/defaultSettings'
import { calcAoFromMetrics } from '@/shared/lib/statistics/calcAoStatistics'
import {
  DEFAULT_AVERAGES,
  DEFAULT_RAIL_AVERAGES,
  DEFAULT_TIMER_AVERAGES,
  parseAverageSize,
  resolveAverages,
  toCustomAverages
} from '@/shared/lib/statistics/averageSizes'
import { makeSolve } from './fixtures/solve'

describe('parseAverageSize', () => {
  it('accepts a bare size or an ao prefix', () => {
    expect(parseAverageSize('500')).toBe(500)
    expect(parseAverageSize(' ao1500 ')).toBe(1500)
    expect(parseAverageSize('Ao25')).toBe(25)
  })

  it('rejects anything outside the allowed range or not a whole number', () => {
    for (const input of ['', '2', '100001', '12.5', '-5', 'mo3', 'ao']) {
      expect(parseAverageSize(input)).toBeNull()
    }
  })
})

describe('custom average list', () => {
  it('falls back to the defaults while nothing is customized', () => {
    expect(resolveAverages([])).toEqual(DEFAULT_AVERAGES)
    expect(resolveAverages([500, 1500])).toEqual([500, 1500])
  })

  it('stores the default list as no customization', () => {
    expect(toCustomAverages([...DEFAULT_AVERAGES])).toEqual([])
    expect(toCustomAverages([5, 12])).toEqual([5, 12])
  })

  it('keeps separate defaults, with only /stats starting at Ao3 and reaching the thousands', () => {
    expect(DEFAULT_AVERAGES).toEqual([3, 5, 12, 50, 100, 250, 500, 1000])
    expect(DEFAULT_TIMER_AVERAGES).toEqual([5, 12, 50, 100])
    expect(DEFAULT_RAIL_AVERAGES).toEqual([3, 5, 12])
  })

  it('uses the defaults it is given for the timer list', () => {
    expect(resolveAverages([], DEFAULT_TIMER_AVERAGES)).toEqual(DEFAULT_TIMER_AVERAGES)
    expect(toCustomAverages([...DEFAULT_TIMER_AVERAGES], DEFAULT_TIMER_AVERAGES)).toEqual([])
    expect(toCustomAverages([...DEFAULT_AVERAGES], DEFAULT_TIMER_AVERAGES)).toEqual(DEFAULT_AVERAGES)
  })

  it('keeps a saved list exactly when persisted settings merge over the defaults', () => {
    const saved = toMerged(defaultSettings, {
      features: { ...defaultSettings.features, customAverages: [500, 1500], timerAverages: [25], railAverages: [7] }
    })
    expect(saved.features.customAverages).toEqual([500, 1500])
    expect(saved.features.timerAverages).toEqual([25])
    expect(saved.features.railAverages).toEqual([7])
  })
})

describe('calcAoFromMetrics with custom sizes', () => {
  it('returns only the requested sizes, computed per scope', () => {
    const solves = Array.from({ length: 20 }, (_, index) => makeSolve({ time: 1000 + index * 100 }))
    const result = calcAoFromMetrics(
      { global: solves, session: solves.slice(0, 7), cubeSession: [], cubeAll: [] },
      [7, 20]
    )

    expect(Object.keys(result.global)).toEqual(['ao7', 'ao20'])
    expect(result.global.ao7).toBe(1300)
    expect(result.session.ao7).toBe(1300)
    expect(result.session.ao20).toBe(0)
    expect(result.cubeAll.ao7).toBe(0)
  })
})
