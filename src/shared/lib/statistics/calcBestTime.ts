import getSolvesMetrics from './getSolvesMetrics'
import { Cube } from '@/entities/cube/model/types'
import { CubeCategory } from '@/shared/const/cube-categories'
import { StatisticValue } from '@/shared/types/statistics'
import { CubeSolves } from '@/features/deep-statistics/model/types'

function bestValid(solves: CubeSolves[keyof CubeSolves]): number {
  let best = Infinity
  for (const solve of solves) {
    if (!solve.dnf && solve.time < best) best = solve.time
  }
  return best === Infinity ? 0 : best || 0
}

export function calcBestTimeFromMetrics(solveMetrics: CubeSolves): StatisticValue<number> {
  const { global, session, cubeAll, cubeSession } = solveMetrics

  return {
    global: bestValid(global),
    session: bestValid(session),
    cubeAll: bestValid(cubeAll),
    cubeSession: bestValid(cubeSession)
  }
}

export default function calcBestTime({
  cubesDB,
  category,
  cubeName
}: {
  cubesDB: Cube[] | null
  category: CubeCategory
  cubeName: string
}): StatisticValue<number> {
  return calcBestTimeFromMetrics(getSolvesMetrics({ cubesDB, category, cubeName }))
}
