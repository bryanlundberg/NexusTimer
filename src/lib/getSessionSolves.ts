import { getAllCubes } from "@/db/dbOperations";
import { Cube } from "@/interfaces/Cube";

/**
 * Gets the number of solves in the "session" category for a specific cube by its ID.
 * @param {Object} params - Parameters for getting the session solves.
 * @param {string} params.cubeId - The ID of the cube for which to retrieve session solves.
 * @returns {number} The number of solves in the "session" category for the specified cube.
 */
export default async function getSessionSolves({
  cubeId,
}: {
  cubeId: string;
}): Promise<number> {
  // Load existing cubes from indexDB
  const cubesDB = await getAllCubes();

  if (!cubesDB) return 0;

  // Find the cube with the specified ID in the list
  const cube: Cube | undefined = cubesDB.find((cube) => cube.id === cubeId);

  // Return 0 if the cube is not found
  if (!cube) {
    return 0;
  }

  // Return the number of solves in the 'session' category for the found cube
  return cube.solves.session.length;
}
