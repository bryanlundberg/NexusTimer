import { Categories } from '@/interfaces/Categories'
import { CubeSolves } from '@/interfaces/CubeSolves'
import { Cube } from '@/entities/cube/model/types'
import { Solve } from '@/entities/solve/model/types'

/**
 * Retrieves solves metrics for a specific category and cube name.
 * @param cubesDB
 * @param category
 * @param cubeName
 * @returns {CubeSolves} An object containing solves metrics for global, session, cubeAll, and cubeSession.
 */
export default function getSolvesMetrics({
  cubesDB,
  category,
  cubeName
}: {
  cubesDB: Cube[] | null
  category: Categories
  cubeName: string
}): CubeSolves {
  if (!cubesDB) return { global: [], session: [], cubeAll: [], cubeSession: [] }

  const sortByEndTimeDesc = (a: Solve, b: Solve) => b.endTime - a.endTime

  // Initialize an object to store solves metrics
  const result: CubeSolves = {
    global: [],
    session: [],
    cubeAll: [],
    cubeSession: []
  }

  // Filter cubes by the specified category
  const filteredCubes = cubesDB.filter((cube) => cube.category === category)

  // Iterate through cubes in the specified category
  for (const cube of filteredCubes) {
    result.global.push(...cube.solves.all, ...cube.solves.session)
    result.session.push(...cube.solves.session)
  }

  // Find the target cube by its name
  const targetCube = cubesDB.find((cube) => cube.name === cubeName)

  // If the target cube is found, update metrics for 'cubeAll' and 'cubeSession'
  if (targetCube) {
    result.cubeAll.push(...targetCube.solves.all, ...targetCube.solves.session)
    result.cubeSession.push(...targetCube.solves.session)
  }

  // Sort solves in descending order based on endTime for each category
  result.global.sort(sortByEndTimeDesc)
  result.session.sort(sortByEndTimeDesc)
  result.cubeAll.sort(sortByEndTimeDesc)
  result.cubeSession.sort(sortByEndTimeDesc)

  return result
}
