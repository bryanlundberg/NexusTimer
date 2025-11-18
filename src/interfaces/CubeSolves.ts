import { Solve } from '@/entities/solve/model/types'

export interface CubeSolves {
  global: Solve[]
  session: Solve[]
  cubeSession: Solve[]
  cubeAll: Solve[]
}
