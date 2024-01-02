import { Solve } from "@/interfaces/Solve";
import { sort } from "fast-sort";
import calculateCurrentAo from "./calculateCurrentAo";

/**
 * Calculates the best average of X (AoX) from a given array of solves.
 * @param {Solve[]} solves - An array of Solve objects.
 * @param {number} ao - The desired average length (e.g., 3, 5, 12).
 * @returns {number} The best average of X (AoX) for the given solves.
 */
export default function calculateBestAo(solves: Solve[], ao: number): number {
  // If the number of solves is less than the desired average length, return 0
  if (solves.length < ao) {
    return 0;
  }

  // Array to store calculated averages
  const averages: number[] = [];

  // Iterate through the solves to calculate the current AoX
  for (let i = 0; i <= solves.length - ao; i++) {
    // Calculate the current AoX and add it to the averages array
    const currentAo = calculateCurrentAo(solves.slice(i, i + ao), ao);
    averages.push(currentAo);
  }

  // Sort the averages in ascending order
  const averagesSorted = sort(averages).asc();

  // Return the best (minimum) average of X
  return averagesSorted[0];
}
