import { Cube } from "@/interfaces/Cube";
import { Solve } from "@/interfaces/Solve";
import { SolveTab } from "@/interfaces/types/SolveTabs";
import { saveCube } from "@/db/dbOperations";

/**
 * Moves a solve from session solves to all solves within a given cube and updates the cube on the list and vice versa.
 * @param {Solve} solve - The solve to be moved.
 * @param {Cube} selectedCube - The cube containing the solves.
 * @param {"Session" | "All"} type - The type of solves to move the solve to ("Session" or "All").
 * @returns {Cube} The updated cube.
 */
export default async function moveSolve({
  solve,
  selectedCube,
  type,
}: {
  solve: Solve;
  selectedCube: Cube;
  type: SolveTab;
}): Promise<Cube> {
  const { session, all } = selectedCube.solves;

  if (type === "Session") {
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

      await saveCube({
        ...selectedCube,
        solves: selectedCube.solves,
      });
    } else {
      // Handle the case where the solve is not found in session solves
      console.warn("Solve not found in session solves storage.");
    }
  } else if (type === "All") {
    // Check if the solve is in the all solves
    const solveIndexInAll = all.findIndex(
      (allSolve) => allSolve.id === solve.id
    );

    if (solveIndexInAll !== -1) {
      // Move the solve from all to session solves
      selectedCube.solves.session = [...session, solve];
      selectedCube.solves.all = all.filter(
        (allSolve) => allSolve.id !== solve.id
      );
      // Update the cube on the list
      await saveCube({
        ...selectedCube,
        solves: selectedCube.solves,
      });
    } else {
      // Handle the case where the solve is not found in all solves
      console.warn("Solve not found in All solves storage.");
    }
  }

  // If the type is neither "session" nor "all", return the cube without updating
  return selectedCube;
}
