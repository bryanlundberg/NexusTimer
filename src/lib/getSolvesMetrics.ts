import { getAllCubes } from "@/db/dbOperations";
import { Categories } from "@/interfaces/Categories";
import { CubeSolves } from "@/interfaces/CubeSolves";

/**
 * Retrieves solves metrics for a specific category and cube name.
 * @param {Categories} category - The category of the solves to retrieve metrics for.
 * @param {string} cubeName - The name of the cube to retrieve metrics for.
 * @returns {CubeSolves} An object containing solves metrics for global, session, cubeAll, and cubeSession.
 */
export default async function getSolvesMetrics(
  category: Categories,
  cubeName: string
): Promise<CubeSolves> {
  // Load existing cubes from indexDB
  const cubesDB = await getAllCubes();

  // Initialize an object to store solves metrics
  const result: CubeSolves = {
    global: [],
    session: [],
    cubeAll: [],
    cubeSession: [],
  };

  // Filter cubes by the specified category
  const filteredCubes = cubesDB.filter((cube) => cube.category === category);

  // Iterate through cubes in the specified category
  for (const cube of filteredCubes) {
    // Concatenate solves from 'all' and 'session' categories to 'global'
    result.global = result.global.concat(cube.solves.all, cube.solves.session);
    // Concatenate solves from 'session' category to 'session'
    result.session = result.session.concat(cube.solves.session);
  }

  // Find the target cube by its name
  const targetCube = cubesDB.find((cube) => cube.name === cubeName);

  // If the target cube is found, update metrics for 'cubeAll' and 'cubeSession'
  if (targetCube) {
    result.cubeAll = targetCube.solves.all.concat(targetCube.solves.session);
    result.cubeSession = targetCube.solves.session;
  }

  // Sort solves in descending order based on endTime for each category
  result.global.sort((a, b) => b.endTime - a.endTime);
  result.session.sort((a, b) => b.endTime - a.endTime);
  result.cubeAll.sort((a, b) => b.endTime - a.endTime);
  result.cubeSession.sort((a, b) => b.endTime - a.endTime);

  return result;
}
