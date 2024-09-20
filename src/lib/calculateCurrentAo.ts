import { Solve } from "@/interfaces/Solve";

/**
 * Calculates the current average of X (AoX) from a given array of solves.
 * @param {Solve[]} solves - An array of Solve objects.
 * @param {number} ao - The desired average length (e.g., 3, 5, 12).
 * @returns {number} The current average of X (AoX) for the given solves.
 */
export default function calculateCurrentAo(
  solves: Solve[],
  ao: number
): number {
  if (ao <= 2) {
    return 0;
  }
  // If the number of solves is less than the desired average length, return 0
  if (!solves || solves.length < ao) {
    return 0;
  }

  // Extract the first 'ao' solves for calculation
  // Sort the solves by fastest solve time in ascending order
  // Remove the best and worst time from the array to trim the average
  const sortedSolves = solves
    .slice(0, ao)
    .sort((a, b) => a.time - b.time)
    .slice(1, ao - 1);

  // Calculate the sum of trimmed solve times
  let sum = 0;
  for (let i = 0; i < sortedSolves.length; i++) {
    sum += sortedSolves[i].time;
  }

  // Balance the removed solves (best - worst) to get the average
  return sum / (ao - 2);
}
