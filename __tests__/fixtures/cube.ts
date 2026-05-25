import { Cube } from '@/entities/cube/model/types'
import { Solve } from '@/entities/solve/model/types'
import { CubeCategory } from '@/shared/const/cube-categories'

export function makeCube(
  overrides: Partial<Cube> & {
    sessionSolves?: Solve[]
    allSolves?: Solve[]
  } = {}
): Cube {
  const { sessionSolves = [], allSolves = [], solves, ...rest } = overrides
  return {
    id: 'cube-' + Math.random().toString(36).slice(2),
    name: 'My Cube',
    category: '3x3' as CubeCategory,
    favorite: false,
    createdAt: 0,
    solves: solves ?? { session: sessionSolves, all: allSolves },
    ...rest
  }
}
