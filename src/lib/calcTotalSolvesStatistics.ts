import getSolvesMetrics from './getSolvesMetrics'
import { Cube } from '@/entities/cube/model/types'
import { CubeCategory } from '@/shared/config/cube-categories'

/**
 * Calculates the total number of solves for different solve sets (global, session, cubeSession, cubeAll) of a specific cube.
 * @param {Categories} category - The category of the cube solves.
 * @param {string} cubeName - The name of the cube.
 * @returns {StatisticN} The total number of solves for global, session, cubeSession, and cubeAll.
 */
export default function calcTotalSolvesStatistics({
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

  // Calculate the total number of solves for each solve set
  return {
    global: global.length,
    session: session.length,
    cubeAll: cubeAll.length,
    cubeSession: cubeSession.length
  }
}
