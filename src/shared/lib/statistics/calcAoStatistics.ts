import getSolvesMetrics from './getSolvesMetrics'
import { calcBestAos } from './calcBestAo'
import { Cube } from '@/entities/cube/model/types'
import { CubeCategory } from '@/shared/const/cube-categories'
import { AoStatistics } from '@/shared/types/statistics'
import { CubeSolves } from '@/features/deep-statistics/model/types'

const AO_SIZES = [3, 5, 12, 50, 100, 1000]

function bestAos(solves: CubeSolves[keyof CubeSolves]) {
  const [ao3, ao5, ao12, ao50, ao100, ao1000] = calcBestAos(solves, AO_SIZES)
  return { ao3, ao5, ao12, ao50, ao100, ao1000 }
}

export function calcAoFromMetrics(solveMetrics: CubeSolves): AoStatistics {
  const { global, session, cubeAll, cubeSession } = solveMetrics

  return {
    global: bestAos(global),
    session: bestAos(session),
    cubeAll: bestAos(cubeAll),
    cubeSession: bestAos(cubeSession)
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
