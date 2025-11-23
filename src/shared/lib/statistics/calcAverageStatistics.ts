import getSolvesMetrics from './getSolvesMetrics'
import { Cube } from '@/entities/cube/model/types'
import { CubeCategory } from '@/shared/const/cube-categories'
import { StatisticValue } from '@/shared/types/statistics'

export default function calcAverageStatistics({
  cubesDB,
  category,
  cubeName
}: {
  cubesDB: Cube[] | null
  category: CubeCategory
  cubeName: string
}): StatisticValue<number> {
  // Get solve metrics for global, session, cubeSession, and cubeAll
  const solveMetrics = getSolvesMetrics({ cubesDB, category, cubeName })

  // Filter out DNF solves from each solve set
  const filteredGlobal = solveMetrics.global.filter((solve) => !solve.dnf)
  const filteredSession = solveMetrics.session.filter((solve) => !solve.dnf)
  const filteredCubeSession = solveMetrics.cubeSession.filter((solve) => !solve.dnf)
  const filteredCubeAll = solveMetrics.cubeAll.filter((solve) => !solve.dnf)

  // Calculate average solve time for global solves
  const globalTime = filteredGlobal.reduce((total, acc) => total + acc.time, 0) / filteredGlobal.length

  // Calculate average solve time for session solves
  const sessionTime = filteredSession.reduce((total, acc) => total + acc.time, 0) / filteredSession.length

  // Calculate average solve time for cubeSession solves
  const cubeSessionTime = filteredCubeSession.reduce((total, acc) => total + acc.time, 0) / filteredCubeSession.length

  // Calculate average solve time for cubeAll solves
  const cubeAllTime = filteredCubeAll.reduce((total, acc) => total + acc.time, 0) / filteredCubeAll.length

  // Return the calculated average solve times for each solve set
  return {
    global: globalTime > 0 ? globalTime : 0,
    session: sessionTime > 0 ? sessionTime : 0,
    cubeSession: cubeSessionTime > 0 ? cubeSessionTime : 0,
    cubeAll: cubeAllTime > 0 ? cubeAllTime : 0
  }
}
