import { Cube } from '@/entities/cube/model/types'
import { Solve } from '@/entities/solve/model/types'
import { CubeCategory } from '@/shared/const/cube-categories'
import { CubeSolves } from '@/features/deep-statistics/model/types'

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
  category: CubeCategory
  cubeName: string
}): CubeSolves {
  if (!cubesDB) return { global: [], session: [], cubeAll: [], cubeSession: [] }

  const sortByEndTimeDesc = (a: Solve, b: Solve) => b.endTime - a.endTime
  const notDeleted = (s: Solve) => !s.isDeleted

  // Initialize an object to store solves metrics
  const result: CubeSolves = {
    global: [],
    session: [],
    cubeAll: [],
    cubeSession: []
  }

  // Filter cubes by the specified category
  const filteredCubes = cubesDB.filter((cube) => cube.category === category)

  let targetAll: Solve[] | null = null
  let targetSession: Solve[] | null = null

  // Iterate through cubes in the specified category, filtering deleted solves once per cube
  for (const cube of filteredCubes) {
    const allFiltered = cube.solves.all.filter(notDeleted)
    const sessionFiltered = cube.solves.session.filter(notDeleted)
    result.global.push(...allFiltered, ...sessionFiltered)
    result.session.push(...sessionFiltered)

    if (cube.name === cubeName) {
      targetAll = allFiltered
      targetSession = sessionFiltered
    }
  }

  // Fallback: target cube might be in a different category — preserve original lookup semantics.
  if (!targetAll) {
    const targetCube = cubesDB.find((cube) => cube.name === cubeName)
    if (targetCube) {
      targetAll = targetCube.solves.all.filter(notDeleted)
      targetSession = targetCube.solves.session.filter(notDeleted)
    }
  }

  if (targetAll && targetSession) {
    result.cubeAll.push(...targetAll, ...targetSession)
    result.cubeSession.push(...targetSession)
  }

  // Sort solves in descending order based on endTime for each category
  result.global.sort(sortByEndTimeDesc)
  result.session.sort(sortByEndTimeDesc)
  result.cubeAll.sort(sortByEndTimeDesc)
  result.cubeSession.sort(sortByEndTimeDesc)

  return result
}
