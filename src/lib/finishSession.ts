import { saveCube } from "@/db/dbOperations";
import { Cube } from "@/interfaces/Cube";

/**
 * Updates sessions for cubes of the same category.
 * @param {Cube | null} selectedCube - The cube whose sessions will be updated.
 * @param {Cube[] | null} cubesDB - The array of cubes.
 * @returns {Promise<Cube[] | null>} The updated array of cubes or null.
 */
export default async function finishSession({
  selectedCube,
  cubesDB,
}: {
  selectedCube: Cube | null;
  cubesDB: Cube[] | null;
}): Promise<Cube[] | null> {
  if (!selectedCube) return null;
  if (!cubesDB) return null;

  const cubes = [...cubesDB];
  const selection = { ...selectedCube };

  for (const cube of cubes) {
    if (
      cube.category === selection.category &&
      cube.solves.session.length >= 1
    ) {
      cube.solves.all.push(...cube.solves.session);
      cube.solves.session = [];

      await saveCube({
        ...cube,
        solves: cube.solves,
      });
    }
  }

  return cubes;
}
