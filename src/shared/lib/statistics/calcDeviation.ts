import getSolvesMetrics from './getSolvesMetrics'
import getDeviation from './getDeviation'
import { Cube } from '@/entities/cube/model/types'
import { CubeCategory } from '@/shared/config/cube-categories'

/**
 * Calculates the standard deviation of solve times for different solve sets (global, session, cubeSession, cubeAll) of a specific cube.
 * @param {Object} params - Parameters for calculating standard deviation.
 * @param {Cube[] | null} params.cubesDB - The array of cubes.
 * @param {Categories} params.category - The category of the cube solves.
 * @param {string} params.cubeName - The name of the cube.
 * @returns {StatisticN} The standard deviation of solve times for global, session, cubeSession, and cubeAll.
 */
export default function calcDeviation({
  cubesDB,
  category,
  cubeName
}: {
  cubesDB: Cube[] | null
  category: CubeCategory
  cubeName: string
}): StatisticN {
  // Get solve metrics for global, session, cubeSession, and cubeAll
  const { global, session, cubeAll, cubeSession } = getSolvesMetrics({
    cubesDB,
    category,
    cubeName
  })

  // Calculate standard deviation for each solve set
  return {
    global: getDeviation(global),
    session: getDeviation(session),
    cubeAll: getDeviation(cubeAll),
    cubeSession: getDeviation(cubeSession)
  }
}
