import { Cube } from "@/interfaces/Cube";

// combine the selected cube with the cubesDB returning the cubes array with the updated selected cube

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
