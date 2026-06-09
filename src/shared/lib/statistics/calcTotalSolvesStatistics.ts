import getSolvesMetrics from './getSolvesMetrics'
import { Cube } from '@/entities/cube/model/types'
import { CubeCategory } from '@/shared/const/cube-categories'
import { StatisticValue } from '@/shared/types/statistics'
import { CubeSolves } from '@/features/deep-statistics/model/types'

export function calcTotalSolvesFromMetrics(solveMetrics: CubeSolves): StatisticValue<number> {
  const { global, session, cubeAll, cubeSession } = solveMetrics
  return {
    global: global.length,
    session: session.length,
    cubeAll: cubeAll.length,
    cubeSession: cubeSession.length
  }
}

export default function calcTotalSolvesStatistics({
  cubesDB,
  category,
  cubeName
}: {
  cubesDB: Cube[] | null
  category: CubeCategory
  cubeName: string
}): StatisticValue<number> {
  return calcTotalSolvesFromMetrics(getSolvesMetrics({ cubesDB, category, cubeName }))
}
