import { Solve } from '@/entities/solve/model/types'

export interface CubeSolves {
  global: Solve[]
  session: Solve[]
  cubeSession: Solve[]
  cubeAll: Solve[]
}

interface CubeStatistics {
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

export interface DisplayTimerStatistics {
  global: CubeStatistics
  session: CubeStatistics
  cubeSession: CubeStatistics
}
