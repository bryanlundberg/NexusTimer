import { Solve } from "@/interfaces/Solve";
import { Cube } from "@/interfaces/Cube";
import loadCubes from "./loadCubes";

/**
 * Adds a solve to the session of the specified cube and updates the local storage.
 * @param {Object} params - The parameters for adding a solve.
 * @param {string} params.cubeId - The ID of the cube to which the solve will be added.
 * @param {Solve} params.solve - The solve to be added.
 * @returns {Cube[]} The updated list of cubes after adding the solve.
 */
export default function addSolve({
  cubeId,
  solve,
}: {
  cubeId: string;
  solve: Solve;
}): Cube[] {
  // Load the list of cubes from local storage
  const cubesDB = loadCubes();

  // Update the session of the specified cube with the new solve
  const cubesAddedSolve = cubesDB.map((cube) => {
    if (cube.id === cubeId) {
      cube.solves.session.unshift(solve);
    }
    return cube;
  });

  // Update local storage with the modified list of cubes
  window.localStorage.setItem("cubes", JSON.stringify(cubesAddedSolve));

  // Return the updated list of cubes
  return cubesAddedSolve;
}
