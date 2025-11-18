import getSolvesMetrics from './getSolvesMetrics'
import { sort } from 'fast-sort'
import { Cube } from '@/entities/cube/model/types'
import { CubeCategory } from '@/shared/config/cube-categories'

/**
 * Calculates the best solve time for different solve sets (global, session, cubeSession, cubeAll) of a specific cube.
 * @param {Object} params - Parameters for calculating the best solve time.
 * @param {Cube[] | null} params.cubesDB - The array of cubes.
 * @param {Categories} params.category - The category of the cube solves.
 * @param {string} params.cubeName - The name of the cube.
 * @returns {StatisticN} The best solve times for global, session, cubeSession, and cubeAll.
 */
export default function calcBestTime({
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

  // Sort solve sets in ascending order based on solve times
  const bestGlobal = sort(global).asc((u) => (u.dnf ? Infinity : u.time))
  const bestSession = sort(session).asc((u) => (u.dnf ? Infinity : u.time))
  const bestCubeAll = sort(cubeAll).asc((u) => (u.dnf ? Infinity : u.time))
  const bestCubeSession = sort(cubeSession).asc((u) => (u.dnf ? Infinity : u.time))

  // Return the best solve times for each solve set
  return {
    global: bestGlobal[0]?.dnf ? 0 : bestGlobal[0]?.time || 0,
    session: bestSession[0]?.dnf ? 0 : bestSession[0]?.time || 0,
    cubeAll: bestCubeAll[0]?.dnf ? 0 : bestCubeAll[0]?.time || 0,
    cubeSession: bestCubeSession[0]?.dnf ? 0 : bestCubeSession[0]?.time || 0
  }
}
