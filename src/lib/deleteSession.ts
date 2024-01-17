import { getAllCubes, saveBatchCubes } from "@/db/dbOperations";
import { Cube } from "@/interfaces/Cube";

/**
 * Deletes the session solves of a selected cube and updates the list of cubes in indexDB.
 * @param {Cube} selectedCube - The cube whose session solves will be deleted.
 * @returns {Cube[]} The updated list of cubes after deleting the session solves.
 */
export default async function deleteSession(
  selectedCube: Cube
): Promise<Cube[]> {
  // Clear the session solves of the selected cube
  selectedCube.solves.session = [];

  // Load existing cubes from indexDB
  const cubesDB = await getAllCubes();

  // If no cubes are present, return an empty array
  if (!cubesDB) return [];

  // Create a new list of cubes with the updated selected cube
  const newCubesList: Cube[] = cubesDB.map((targetCube) =>
    selectedCube.id === targetCube.id ? selectedCube : targetCube
  );

  // Update the list of cubes in indexDB
  await saveBatchCubes(newCubesList);

  // Return the updated list of cubes
  return newCubesList;
}
