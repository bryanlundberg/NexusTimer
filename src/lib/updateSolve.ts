import { saveCube } from "@/db/dbOperations";
import { Cube } from "@/interfaces/Cube";
import { Solve } from "@/interfaces/Solve";
import { useState } from "react";

/**
 * Updates the specified solve in the cubes' solves arrays.
 * @param {string} solveId - The ID of the solve to be updated.
 * @param {string} type - The type of update: "+2", "DNF", "COMMENT", "BOOKMARK", or "DELETE".
 * @param {string} [comment] - The comment to be added or updated (optional).
 * @returns {Cube | null} The updated cube or null if not found.
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
  type: "+2" | "DNF" | "COMMENT" | "BOOKMARK" | "DELETE" | "UNDO";
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
        }else if(type === "UNDO" && deletedSolve) {
          solveArray.push(deletedSolve);
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
