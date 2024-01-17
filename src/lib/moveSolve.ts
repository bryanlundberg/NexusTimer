import { Cube } from "@/interfaces/Cube";
import { Solve } from "@/interfaces/Solve";
import { SolveTab } from "@/interfaces/types/SolveTabs";
import { getAllCubes, getCubeById, saveCube } from "@/db/dbOperations";

/**
 * Moves a solve from session solves to all solves within a given cube and updates the cube on the list and vice versa.
 * @param {Solve} solve - The solve to be moved.
 * @param {Cube} selectedCube - The cube containing the solves.
 * @param {"session" | "all"} type - The type of solves to move the solve to ("session" or "all").
 * @returns {Cube[]} The updated list of cubes.
 */
export default async function moveSolve(
  solve: Solve,
  selectedCube: Cube,
  type: SolveTab
): Promise<Cube[]> {
  if (!selectedCube) return await getAllCubes();

  const cube = await getCubeById(selectedCube.id);

  if (!cube) return await getAllCubes();

  const { session, all } = cube.solves;

  if (type === "Session") {
    // Check if the solve is in the session solves
    const solveIndexInSession = session.findIndex(
      (sessionSolve) => sessionSolve.id === solve.id
    );

    if (solveIndexInSession !== -1) {
      // Move the solve from session to all solves
      cube.solves.all = [...all, solve];
      cube.solves.session = session.filter(
        (sessionSolve) => sessionSolve.id !== solve.id
      );

      await saveCube({
        id: cube.id,
        name: cube.name,
        category: cube.category,
        solves: {
          all: cube.solves.all,
          session: cube.solves.session,
        },
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
      cube.solves.session = [...session, solve];
      cube.solves.all = all.filter((allSolve) => allSolve.id !== solve.id);
      // Update the cube on the list
      await saveCube({
        id: cube.id,
        name: cube.name,
        category: cube.category,
        solves: {
          all: cube.solves.all,
          session: cube.solves.session,
        },
      });
    } else {
      // Handle the case where the solve is not found in all solves
      console.warn("Solve not found in All solves storage.");
    }
  }

  // If the type is neither "session" nor "all", return the cube without updating
  return await getAllCubes();
}
