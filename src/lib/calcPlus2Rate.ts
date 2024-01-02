import { Solve } from "@/interfaces/Solve";

/**
 * Calculates the number of solves with a "+2" penalty in a given array of solves.
 * @param {Solve[]} solves - An array of Solve objects.
 * @returns {number} The count of solves with a "+2" penalty.
 */
export default function calcPlus2Rate(solves: Solve[]): number {
  // Use the reduce function to count the number of solves with a "+2" penalty
  return solves.reduce((total, acc) => (acc.plus2 ? total + 1 : total), 0);
}
