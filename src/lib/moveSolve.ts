import { Cube } from "@/interfaces/Cube";
import { Solve } from "@/interfaces/Solve";
import updateCubeOnList from "./updateCubeOnList";

/**
 * Moves a solve from session solves to all solves within a given cube and updates the cube on the list.
 * @param {Solve} solve - The solve to be moved.
 * @param {Cube} selectedCube - The cube containing the solves.
 * @returns {Cube[]} The updated list of cubes.
 */
export default function moveSolve(solve: Solve, selectedCube: Cube): Cube[] {
  const { session, all } = selectedCube.solves;

  // Check if the solve is in the session solves
  const solveIndexInSession = session.findIndex(
    (sessionSolve) => sessionSolve.id === solve.id
  );

  if (solveIndexInSession !== -1) {
    // Move the solve from session to all solves
    selectedCube.solves.all = [...all, solve];
    selectedCube.solves.session = session.filter(
      (sessionSolve) => sessionSolve.id !== solve.id
    );

    // Update the cube on the list
    return updateCubeOnList(selectedCube);
  } else {
    // Handle the case where the solve is not found in session solves
    console.warn("Solve not found in session solves.");
    return updateCubeOnList(selectedCube);
  }
}
