import { Solve } from '@/entities/solve/model/types'

export type CubeSolves = {
  global: Solve[]
  session: Solve[]
  cubeSession: Solve[]
  cubeAll: Solve[]
}

export type CubeStatistics = {
  count: number
  best: number
  deviation: number
  mean: number
  worst: number
  [average: `ao${number}`]: number
}

export type DisplayTimerStatistics = {
  global: CubeStatistics
  session: CubeStatistics
  cubeSession: CubeStatistics
}
