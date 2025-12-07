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
  ao3: number
  ao5: number
  ao12: number
  ao50: number
  ao100: number
  deviation: number
  mean: number
  worst: number
}

export type DisplayTimerStatistics = {
  global: CubeStatistics
  session: CubeStatistics
  cubeSession: CubeStatistics
}
