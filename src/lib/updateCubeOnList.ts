import { Cube } from "@/interfaces/Cube";

/**
 * Updates a cube in the list of cubes.
 * @param {Cube} cube - The cube to be updated.
 * @returns {Cube[]} The updated array of cubes.
 * @throws {Error} Throws an error if the cube with the specified ID is not found.
 */
export default function updateCubeOnList(cube: Cube): Cube[] {
  const cubesDB = loadCubes();
  const cubeIndex = cubesDB.findIndex(
    (targetCube) => targetCube.id === cube.id
  );

  if (cubeIndex === -1) {
    throw new Error(`Cube with ID ${cube.id} not found.`);
  }

  const newCubesList: Cube[] = cubesDB.map((targetCube) =>
    targetCube.id === cube.id ? cube : targetCube
  );

  window.localStorage.setItem("cubes", JSON.stringify(newCubesList));
  return newCubesList;
}
