import getSolvesMetrics from './getSolvesMetrics'
import getDeviation from './getDeviation'
import { Cube } from '@/entities/cube/model/types'
import { CubeCategory } from '@/shared/const/cube-categories'
import { StatisticValue } from '@/shared/types/statistics'
import { CubeSolves } from '@/features/deep-statistics/model/types'

export function calcDeviationFromMetrics(solveMetrics: CubeSolves): StatisticValue<number> {
  const { global, session, cubeAll, cubeSession } = solveMetrics

  return {
    global: getDeviation(global),
    session: getDeviation(session),
    cubeAll: getDeviation(cubeAll),
    cubeSession: getDeviation(cubeSession)
  }
}

/**
 * Calculates the standard deviation of solve times for different solve sets (global, session, cubeSession, cubeAll) of a specific cube.
 * @param {Object} params - Parameters for calculating standard deviation.
 * @param {Cube[] | null} params.cubesDB - The array of cubes.
 * @param {category} params.category - The category of the cube solves.
 * @param {string} params.cubeName - The name of the cube.
 * @returns {StatisticValue} The standard deviation of solve times for global, session, cubeSession, and cubeAll.
 */
export default function calcDeviation({
  cubesDB,
  category,
  cubeName
}: {
  cubesDB: Cube[] | null
  category: CubeCategory
  cubeName: string
}): StatisticValue<number> {
  return calcDeviationFromMetrics(getSolvesMetrics({ cubesDB, category, cubeName }))
}
