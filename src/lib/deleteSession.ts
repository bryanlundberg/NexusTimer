import { saveCube } from "@/db/dbOperations";
import { Cube } from "@/interfaces/Cube";

/**
 * Deletes the session solves of a selected cube and updates the list of cubes in indexDB.
 * @param {Cube} selectedCube - The cube whose session solves will be deleted.
 * @returns {Cube[]} The updated list of cubes after deleting the session solves.
 */
export default async function deleteSession({
  selectedCube,
  cubesDB,
}: {
  selectedCube: Cube | null;
  cubesDB: Cube[] | null;
}): Promise<Cube | null> {
  if (!selectedCube) return null;
  if (!cubesDB) return null;

  // Clear the session solves of the selected cube
  selectedCube.solves.session = [];

  // Update the list of cubes in indexDB
  await saveCube({
    id: selectedCube.id,
    name: selectedCube.name,
    category: selectedCube.category,
    solves: selectedCube.solves,
  });

  // Return the updated list of cubes
  return selectedCube;
}
