import { Cube } from "@/interfaces/Cube";

/**
 * Combines the selected cube with the cubesDB, returning the cubes array with the updated selected cube.
 * @param {Object} options - Options for the merge.
 * @param {Cube | null} options.selectedCube - The selected cube to be merged.
 * @param {Cube[] | null} options.cubesDB - The database of cubes to be merged with.
 * @returns {Cube[]} The merged array of cubes.
 */
export function mergeSelectedCube({
  selectedCube,
  cubesDB,
}: {
  selectedCube: Cube | null;
  cubesDB: Cube[] | null;
}): Cube[] {
  if (!cubesDB) return [];

  const cloneDB = [...cubesDB];

  if (!selectedCube) return cloneDB;

  for (let x = 0; x < cubesDB.length; x++) {
    if (cubesDB[x]?.id === selectedCube.id) {
      cubesDB[x].solves = selectedCube.solves;
    }
  }

  return cloneDB;
}
