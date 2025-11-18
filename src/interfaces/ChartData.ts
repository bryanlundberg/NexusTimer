import { Solve } from '@/entities/solve/model/types'

export interface ChartData {
  global: Solve[]
  session: Solve[]
  cubeSession: Solve[]
  cubeAll: Solve[]
}
