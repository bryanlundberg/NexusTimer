import getSolvesMetrics from './getSolvesMetrics'
import { Cube } from '@/entities/cube/model/types'
import { CubeCategory } from '@/shared/config/cube-categories'
import { StatisticValue } from '@/shared/types/statistics'

export default function calcTotalSolvesStatistics({
  cubesDB,
  category,
  cubeName
}: {
  cubesDB: Cube[] | null
  category: CubeCategory
  cubeName: string
}): StatisticValue<number> {
  const { global, session, cubeAll, cubeSession } = getSolvesMetrics({
    cubesDB,
    category,
    cubeName
  })

  return {
    global: global.length,
    session: session.length,
    cubeAll: cubeAll.length,
    cubeSession: cubeSession.length
  }
}
