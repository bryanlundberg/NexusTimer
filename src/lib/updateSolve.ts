import { Cube } from "@/interfaces/Cube";
import { Solve } from "@/interfaces/Solve";

/**
 * Updates the specified solve in the cubes' solves arrays.
 * @param {string} solveId - The ID of the solve to be updated.
 * @param {string} type - The type of update: "+2", "DNF", "COMMENT", or "BOOKMARK".
 * @param {string} [comment] - The comment to be added or updated (optional).
 * @returns {Cube[]} The updated array of cubes.
 */
export default function updateSolve({
  solveId,
  type,
  comment,
}: {
  solveId: string;
  type: "+2" | "DNF" | "COMMENT" | "BOOKMARK";
  comment?: string;
}): Cube[] {
  const cubesDB = loadCubes();

  for (const cube of cubesDB) {
    const updateSolveArray = (solveArray: Solve[]) => {
      const solveToUpdate = solveArray.find((solve) => solve.id === solveId);

      if (solveToUpdate) {
        if (type === "+2") {
          solveToUpdate.plus2 = !solveToUpdate.plus2;
          solveToUpdate.time += solveToUpdate.plus2 ? 2000 : -2000;
        } else if (type === "COMMENT") {
          solveToUpdate.comment = comment ?? "";
        } else if (type === "BOOKMARK") {
          solveToUpdate.bookmark = !solveToUpdate.bookmark;
        }
      }
    };

    updateSolveArray(cube.solves.all);
    updateSolveArray(cube.solves.session);
  }

  window.localStorage.setItem("cubes", JSON.stringify(cubesDB));
  return cubesDB;
}
