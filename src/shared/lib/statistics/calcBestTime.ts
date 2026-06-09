import getSolvesMetrics from './getSolvesMetrics'
import { sort } from 'fast-sort'
import { Cube } from '@/entities/cube/model/types'
import { CubeCategory } from '@/shared/const/cube-categories'
import { StatisticValue } from '@/shared/types/statistics'
import { CubeSolves } from '@/features/deep-statistics/model/types'

export function calcBestTimeFromMetrics(solveMetrics: CubeSolves): StatisticValue<number> {
  const { global, session, cubeAll, cubeSession } = solveMetrics

  const bestGlobal = sort(global).asc((u) => (u.dnf ? Infinity : u.time))
  const bestSession = sort(session).asc((u) => (u.dnf ? Infinity : u.time))
  const bestCubeAll = sort(cubeAll).asc((u) => (u.dnf ? Infinity : u.time))
  const bestCubeSession = sort(cubeSession).asc((u) => (u.dnf ? Infinity : u.time))

  return {
    global: bestGlobal[0]?.dnf ? 0 : bestGlobal[0]?.time || 0,
    session: bestSession[0]?.dnf ? 0 : bestSession[0]?.time || 0,
    cubeAll: bestCubeAll[0]?.dnf ? 0 : bestCubeAll[0]?.time || 0,
    cubeSession: bestCubeSession[0]?.dnf ? 0 : bestCubeSession[0]?.time || 0
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
