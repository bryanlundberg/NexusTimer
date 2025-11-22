import { Solve } from '@/entities/solve/model/types'

export type StatisticScope = 'global' | 'session' | 'cubeSession' | 'cubeAll'

export type StatisticValue<T> = Record<StatisticScope, T>

export type AverageOf = 'ao3' | 'ao5' | 'ao12' | 'ao50' | 'ao100' | 'ao1000'

export type AoStatistics = Record<StatisticScope, Record<AverageOf, number>>

export type DeepStatistics = {
  average: StatisticValue<number>
  timeSpent: StatisticValue<string>
  counter: StatisticValue<number>
  stats: AoStatistics
  deviation: StatisticValue<number>
  successRate: StatisticValue<string>
  best: StatisticValue<number>
  data: StatisticValue<Solve[]>
}
