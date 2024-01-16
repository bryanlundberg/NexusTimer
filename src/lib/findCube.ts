import { Cube } from "@/interfaces/Cube";

/**
 * Finds a cube with the specified ID from the list of cubes.
 * @param {Object} params - Parameters for finding the cube.
 * @param {string} params.cubeId - The ID of the cube to be found.
 * @returns {Cube | null} The found cube or null if not found.
 */
export default function findCube({ cubeId }: { cubeId: string }): Cube | null {
  // Load existing cubes from indexDB
  const cubesDB = loadCubes();

  // Find the cube with the specified ID in the list
  const foundCube = cubesDB?.find((cube) => cube.id === cubeId) || null;

  // Return the found cube or null if not found
  return foundCube;
}
