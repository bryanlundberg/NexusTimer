import { Cube } from "@/interfaces/Cube";
import loadCubes from "./loadCubes";

/**
 * Toggles the 'favorite' property of a cube identified by its cubeId.
 * @param {Object} options - Options for updating the cube.
 * @param {string} options.cubeId - The ID of the cube to update.
 * @returns {Cube[]} The updated array of cubes.
 * @throws {Error} Throws an error if the cube with the specified cubeId is not found.
 */
export default function updateCube({ cubeId }: { cubeId: string }): Cube[] {
  const cubesDB = loadCubes();
  const cubeIndex = cubesDB.findIndex((cube) => cube.id === cubeId);

  if (cubeIndex === -1) {
    throw new Error(`Cube with ID ${cubeId} not found.`);
  }

  cubesDB[cubeIndex].favorite = !cubesDB[cubeIndex].favorite;

  window.localStorage.setItem("cubes", JSON.stringify(cubesDB));
  return cubesDB;
}
