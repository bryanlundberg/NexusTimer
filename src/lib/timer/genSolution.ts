import { Categories } from "@/interfaces/Categories";
import { Layers } from "@/interfaces/types/Layers";
import cubeSolver from "cube-solver";

/**
 * Generates cross solutions based on the provided event, scramble, and layer.
 *
 * @param {Categories} event - The event category.
 * @param {string | null} scramble - The scramble string or null if not provided.
 * @param {Layers} layer - The layer color (e.g., "yellow").
 * @returns {CrossSolutions} - Object containing different cross solutions.
 */

export default function genSolution(
  event: Categories,
  scramble: string | null,
  layer: Layers
): CrossSolutions {
  const solution: CrossSolutions = {
    cross: [],
    xcross: [],
    fb: [],
    eoline: [],
  };

  if (event !== "3x3") return solution;

  if (layer === "yellow") {
    solution.cross.push(cubeSolver.solve(`${scramble}`, "cross"));
    solution.cross.push(cubeSolver.solve(`y ${scramble}`, "cross"));
    solution.cross.push(cubeSolver.solve(`y y ${scramble}`, "cross"));
    solution.cross.push(cubeSolver.solve(`y' ${scramble}`, "cross"));
    solution.xcross.push(cubeSolver.solve(`${scramble}`, "xcross"));
    solution.xcross.push(cubeSolver.solve(`y ${scramble}`, "xcross"));
    solution.xcross.push(cubeSolver.solve(`y y ${scramble}`, "xcross"));
    solution.xcross.push(cubeSolver.solve(`y' ${scramble}`, "xcross"));
  }

  return solution;
}
