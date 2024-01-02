import { Cube } from "@/interfaces/Cube";
import loadCubes from "./loadCubes";

/**
 * Deletes a solve with the specified ID from all cubes and updates the list of cubes in local storage.
 * @param {string} solveId - The ID of the solve to be deleted.
 * @returns {Cube[]} The updated list of cubes after deleting the specified solve.
 */
export default function deleteSolve(solveId: string): Cube[] {
  // Load existing cubes from local storage
  const cubesDB = loadCubes();

  // Iterate through each cube in the list
  for (const cube of cubesDB) {
    // Iterate through all solves in the 'all' category
    for (const allSolve of cube.solves.all) {
      // Check if the solve ID matches the specified ID
      if (allSolve.id === solveId) {
        // Find the index of the solve in the 'all' category
        const solveIndex = cube.solves.all.indexOf(allSolve);

        // If the solve is found, remove it from the 'all' category
        if (solveIndex !== -1) {
          cube.solves.all.splice(solveIndex, 1);
        }
      }
    }

    // Iterate through all solves in the 'session' category
    for (const sessionSolve of cube.solves.session) {
      // Check if the solve ID matches the specified ID
      if (sessionSolve.id === solveId) {
        // Find the index of the solve in the 'session' category
        const solveIndex = cube.solves.session.indexOf(sessionSolve);

        // If the solve is found, remove it from the 'session' category
        if (solveIndex !== -1) {
          cube.solves.session.splice(solveIndex, 1);
        }
      }
    }
  }

  // Update the list of cubes in local storage
  window.localStorage.setItem("cubes", JSON.stringify(cubesDB));

  // Return the updated list of cubes
  return cubesDB;
}
