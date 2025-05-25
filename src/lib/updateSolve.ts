import { saveCube } from "@/db/dbOperations";
import { Cube } from "@/interfaces/Cube";
import { Solve } from "@/interfaces/Solve";

/**
 * Updates a solve in a cube's solve arrays based on the specified operation type.
 *
 * @param {Object} params Object containing parameters for the update operation.
 * @param {Cube} params.selectedCube The cube object containing all solves and session solves.
 * @param {string} params.solveId The ID of the solve that needs to be updated.
 * @param {"+2"|"DNF"|"COMMENT"|"BOOKMARK"|"DELETE"|"UNDO"|"MOVE_TO_HISTORY"} params.type The type of update operation to perform on the solve.
 * @param {string} [params.comment] Optional comment to be added or updated for the solve (used when `type` is "COMMENT").
 * @param {Solve} [params.deletedSolve] Optional previously deleted solve used for undo operations (used when `type` is "UNDO").
 * @return {Promise<Cube|null>} Returns the updated cube if the operation is successful, or `null` if the operation fails or the solve is not updated.
 */
export default async function updateSolve({
  selectedCube,
  solveId,
  type,
  comment,
  deletedSolve,
}: {
  selectedCube: Cube;
  solveId: string;
  type: "+2" | "DNF" | "COMMENT" | "BOOKMARK" | "DELETE" | "UNDO" | "MOVE_TO_HISTORY";
  comment?: string;
  deletedSolve?:Solve;
}): Promise<Cube | null> {
  const updateSolveArray = (solveArray: Solve[]) => {
    const solveIndex = solveArray.findIndex((solve) => solve.id === solveId);

    if (solveIndex !== -1 || (type === "UNDO" && deletedSolve)) {
      const solveToUpdate = type === "UNDO" ? deletedSolve : solveArray[solveIndex];

      if(solveToUpdate){
        if (type === "+2") {
          solveToUpdate.plus2 = !solveToUpdate.plus2;
          solveToUpdate.time += solveToUpdate.plus2 ? 2000 : -2000;
        } else if (type === "COMMENT") {
          solveToUpdate.comment = comment ?? "";
        } else if (type === "BOOKMARK") {
          solveToUpdate.bookmark = !solveToUpdate.bookmark;
        } else if (type === "DELETE") {
          deletedSolve = solveToUpdate;
          solveArray.splice(solveIndex, 1); // Remove the solve from the array
        } else if(type === "UNDO" && deletedSolve) {
          solveArray.push(deletedSolve);
        } else if(type === "MOVE_TO_HISTORY") {
          if (solveArray === selection.solves.session) {
            const solveToMove = solveArray.splice(solveIndex, 1)[0];
            const existsInAll = selection.solves.all.some(s => s.id === solveToMove.id);
            if (!existsInAll) selection.solves.all.push(solveToMove);
          }
        }
      }
    }
  };

  const selection = { ...selectedCube };

  updateSolveArray(selection.solves.all);
  updateSolveArray(selection.solves.session);

  await saveCube({
    ...selection,
    solves: selection.solves,
  });

  return selection;
}
