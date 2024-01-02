import { Cube } from "@/interfaces/Cube";
import calcPlus2Rate from "./calcPlus2Rate";
import { Solve } from "@/interfaces/Solve";

/**
 * Calculates the success rate based on plus2 solves for all cubes.
 * @param {Cube[] | null} cubes - An array of cubes or null if no cubes exist.
 * @returns {number | string} The success rate as a percentage or 0 if no solves exist.
 */
export default function getSuccessRate(cubes: Cube[] | null): number | string {
  if (!cubes || cubes.length === 0) return 0;

  const globalSolves: Solve[] = [];

  // Concatenate solves from 'all' and 'session' categories for all cubes
  cubes.forEach((cube) => {
    globalSolves.push(...cube.solves.all, ...cube.solves.session);
  });

  const totalPlus2 = calcPlus2Rate(globalSolves);

  if (globalSolves.length === 0) return 0;

  // Calculate success rate and format it as a percentage with two decimal places
  const successRate = 100 - (totalPlus2 * 100) / globalSolves.length;
  return successRate.toFixed(2);
}
