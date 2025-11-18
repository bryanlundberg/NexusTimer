import getSolvesMetrics from './getSolvesMetrics'
import { Cube } from '@/entities/cube/model/types'
import { CubeCategory } from '@/shared/config/cube-categories'

/**
 * Calculates the average solved time for different solve sets (global, session, cubeSession, cubeAll) of a specific cube.
 * @param {Object} params - Parameters for calculating average solve times.
 * @param {Cube[] | null} params.cubesDB - The array of cubes.
 * @param {Categories} params.category - The category of the cube solves.
 * @param {string} params.cubeName - The name of the cube.
 * @returns {StatisticN} The calculated average solve times for global, session, cubeSession, and cubeAll.
 */
export default function calcAverageStatistics({
  cubesDB,
  category,
  cubeName
}: {
  cubesDB: Cube[] | null
  category: CubeCategory
  cubeName: string
}): StatisticN {
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
