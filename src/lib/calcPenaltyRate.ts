import { Solve } from "@/interfaces/Solve";

/**
 * Calculates the number of solves with a penalty ("+2" penalty or DNF) in a given array of solves.
 * @param {Solve[]} solves - An array of Solve objects.
 * @returns {number} The count of solves with a penalty.
 */
export default function calcPenaltyRate(solves: Solve[]): number {
  if (!solves) return 0;
  // Use the reduce function to count the number of solves with a penalty
  return solves.reduce((total, acc) => (acc.plus2 || acc.dnf ? total + 1 : total), 0);
}
