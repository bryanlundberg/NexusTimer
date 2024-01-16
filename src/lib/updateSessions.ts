import { Cube } from "@/interfaces/Cube";

/**
 * Updates sessions for cubes of the same category.
 * @param {Cube} selectedCube - The cube whose sessions will be updated.
 * @returns {Cube[]} The updated array of cubes.
 */
export default function updateSessions(selectedCube: Cube): Cube[] {
  const cubesDB = loadCubes();

  cubesDB.forEach((cube: Cube) => {
    if (
      cube.category === selectedCube.category &&
      cube.solves.session.length >= 1
    ) {
      cube.solves.all.push(...cube.solves.session);
      cube.solves.session = [];
    }
  });

  window.localStorage.setItem("cubes", JSON.stringify(cubesDB));
  return cubesDB;
}

//MERGESESSION
