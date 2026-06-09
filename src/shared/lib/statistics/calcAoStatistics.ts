import getSolvesMetrics from './getSolvesMetrics'
import calcBestAo from './calcBestAo'
import { Cube } from '@/entities/cube/model/types'
import { CubeCategory } from '@/shared/const/cube-categories'
import { AoStatistics } from '@/shared/types/statistics'
import { CubeSolves } from '@/features/deep-statistics/model/types'

export function calcAoFromMetrics(solveMetrics: CubeSolves): AoStatistics {
  const { global, session, cubeAll, cubeSession } = solveMetrics

  return {
    global: {
      ao3: calcBestAo(global, 3),
      ao5: calcBestAo(global, 5),
      ao12: calcBestAo(global, 12),
      ao50: calcBestAo(global, 50),
      ao100: calcBestAo(global, 100),
      ao1000: calcBestAo(global, 1000)
    },
    session: {
      ao3: calcBestAo(session, 3),
      ao5: calcBestAo(session, 5),
      ao12: calcBestAo(session, 12),
      ao50: calcBestAo(session, 50),
      ao100: calcBestAo(session, 100),
      ao1000: calcBestAo(session, 1000)
    },
    cubeAll: {
      ao3: calcBestAo(cubeAll, 3),
      ao5: calcBestAo(cubeAll, 5),
      ao12: calcBestAo(cubeAll, 12),
      ao50: calcBestAo(cubeAll, 50),
      ao100: calcBestAo(cubeAll, 100),
      ao1000: calcBestAo(cubeAll, 1000)
    },
    cubeSession: {
      ao3: calcBestAo(cubeSession, 3),
      ao5: calcBestAo(cubeSession, 5),
      ao12: calcBestAo(cubeSession, 12),
      ao50: calcBestAo(cubeSession, 50),
      ao100: calcBestAo(cubeSession, 100),
      ao1000: calcBestAo(cubeSession, 1000)
    }
  }
}

export default function calcAoStatistics({
  cubesDB,
  category,
  cubeName
}: {
  cubesDB: Cube[] | null
  category: CubeCategory
  cubeName: string
}): AoStatistics {
  return calcAoFromMetrics(getSolvesMetrics({ cubesDB, category, cubeName }))
}
