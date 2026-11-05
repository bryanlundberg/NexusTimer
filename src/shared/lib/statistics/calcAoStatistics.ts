import getSolvesMetrics from './getSolvesMetrics'
import { calcBestAos } from './calcBestAo'
import { Cube } from '@/entities/cube/model/types'
import { CubeCategory } from '@/shared/const/cube-categories'
import { AoStatistics } from '@/shared/types/statistics'
import { CubeSolves } from '@/features/deep-statistics/model/types'

const AO_SIZES = [3, 5, 12, 50, 100, 1000]

function bestAos(solves: CubeSolves[keyof CubeSolves], sizes: number[]) {
  const values = calcBestAos(solves, sizes)
  return Object.fromEntries(sizes.map((size, index) => [`ao${size}`, values[index]]))
}

export function calcAoFromMetrics(solveMetrics: CubeSolves, sizes: number[] = AO_SIZES): AoStatistics {
  const { global, session, cubeAll, cubeSession } = solveMetrics

  return {
    global: bestAos(global, sizes),
    session: bestAos(session, sizes),
    cubeAll: bestAos(cubeAll, sizes),
    cubeSession: bestAos(cubeSession, sizes)
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
