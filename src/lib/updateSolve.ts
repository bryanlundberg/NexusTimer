import { getCubeById, saveCube } from "@/db/dbOperations";
import { Cube } from "@/interfaces/Cube";
import { Solve } from "@/interfaces/Solve";

/**
 * Updates the specified solve in the cubes' solves arrays.
 * @param {string} solveId - The ID of the solve to be updated.
 * @param {string} type - The type of update: "+2", "DNF", "COMMENT", or "BOOKMARK".
 * @param {string} [comment] - The comment to be added or updated (optional).
 * @returns {Cube[]} The updated array of cubes.
 */
export default async function updateSolve({
  cubeId,
  solveId,
  type,
  comment,
}: {
  cubeId: string;
  solveId: string;
  type: "+2" | "DNF" | "COMMENT" | "BOOKMARK" | "DELETE";
  comment?: string;
}): Promise<Cube | null> {
  if (typeof cubeId !== "string") return null;
  const cube = await getCubeById(cubeId);

  if (!cube) return null;

  const updateSolveArray = (solveArray: Solve[]) => {
    const solveIndex = solveArray.findIndex((solve) => solve.id === solveId);

    if (solveIndex !== -1) {
      const solveToUpdate = solveArray[solveIndex];

      if (type === "+2") {
        solveToUpdate.plus2 = !solveToUpdate.plus2;
        solveToUpdate.time += solveToUpdate.plus2 ? 2000 : -2000;
      } else if (type === "COMMENT") {
        solveToUpdate.comment = comment ?? "";
      } else if (type === "BOOKMARK") {
        solveToUpdate.bookmark = !solveToUpdate.bookmark;
      } else if (type === "DELETE") {
        solveArray.splice(solveIndex, 1); // Remove the solve from the array
      }
    }
  };

  updateSolveArray(cube.solves.all);
  updateSolveArray(cube.solves.session);

  await saveCube({
    name: cube.name,
    id: cube.id,
    category: cube.category,
    solves: {
      all: cube.solves.all,
      session: cube.solves.session,
    },
  });

  return cube;
}
