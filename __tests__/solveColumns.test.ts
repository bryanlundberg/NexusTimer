import type { CubeSolves } from '@/features/deep-statistics/model/types'
import { columnsToMetrics, metricsToColumns } from '@/features/deep-statistics/lib/solveColumns'
import { calcAverageFromMetrics } from '@/shared/lib/statistics/calcAverageStatistics'
import { calcTimeSpentFromMetrics } from '@/shared/lib/statistics/calcTimeSpentStatistics'
import { calcTotalSolvesFromMetrics } from '@/shared/lib/statistics/calcTotalSolvesStatistics'
import { calcAoFromMetrics } from '@/shared/lib/statistics/calcAoStatistics'
import { calcDeviationFromMetrics } from '@/shared/lib/statistics/calcDeviation'
import { calcSuccessRateFromMetrics } from '@/shared/lib/statistics/calcSuccessRate'
import { calcBestTimeFromMetrics } from '@/shared/lib/statistics/calcBestTime'
import { makeSolve } from './fixtures/solve'

function rng(seed: number) {
  let state = seed
  return () => {
    state = (state * 1664525 + 1013904223) % 4294967296
    return state / 4294967296
  }
}

function randomList(random: () => number, count: number) {
  return Array.from({ length: count }, () => {
    const dnf = random() < 0.1
    return makeSolve({
      time: random() < 0.2 ? 9_000 + random() * 3_000 : Math.round(9_000 + random() * 3_000),
      dnf,
      plus2: !dnf && random() < 0.1
    })
  })
}

describe('solve columns', () => {
  it('round-trips time, DNF and +2 in order', () => {
    const random = rng(2)
    const metrics: CubeSolves = {
      global: randomList(random, 50),
      session: randomList(random, 20),
      cubeSession: randomList(random, 10),
      cubeAll: []
    }
    const back = columnsToMetrics(metricsToColumns(metrics).columns)
    for (const key of ['global', 'session', 'cubeSession', 'cubeAll'] as const) {
      expect(back[key].map(({ time, dnf, plus2 }) => ({ time, dnf, plus2 }))).toEqual(
        metrics[key].map(({ time, dnf, plus2 }) => ({ time, dnf: !!dnf, plus2: !!plus2 }))
      )
    }
  })

  it('gives the deep statistics worker the same results as the full solve objects', () => {
    const random = rng(6)
    const metrics: CubeSolves = {
      global: randomList(random, 1_200),
      session: randomList(random, 300),
      cubeSession: randomList(random, 120),
      cubeAll: randomList(random, 600)
    }
    const fromColumns = columnsToMetrics(metricsToColumns(metrics).columns)
    for (const calc of [
      calcAverageFromMetrics,
      calcTimeSpentFromMetrics,
      calcTotalSolvesFromMetrics,
      calcAoFromMetrics,
      calcDeviationFromMetrics,
      calcSuccessRateFromMetrics,
      calcBestTimeFromMetrics
    ]) {
      expect(calc(fromColumns)).toEqual(calc(metrics))
    }
  })

  it('hands over every buffer so nothing is copied', () => {
    const metrics: CubeSolves = { global: randomList(rng(1), 5), session: [], cubeSession: [], cubeAll: [] }
    const { columns, transfer } = metricsToColumns(metrics)
    expect(transfer).toHaveLength(8)
    expect(transfer).toContain(columns.global.times.buffer)
    expect(transfer).toContain(columns.global.flags.buffer)
  })
})
