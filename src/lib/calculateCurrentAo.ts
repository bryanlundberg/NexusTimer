import { Solve } from "@/interfaces/Solve";
import { sort } from "fast-sort";

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
  let result = 0;

  // If the number of solves is less than the desired average length, return 0
  if (solves.length < ao) {
    return result;
  }

  // Extract the first 'ao' solves for calculation
  const cubeAo = solves.slice(0, ao);

  // Sort the solves by fastest solve time in ascending order
  const sortedSolves = sort(cubeAo).asc((u) => u.time);

  // Remove the best and worst time from the array to trim the average
  const trimmedSolves = sortedSolves.slice(1, ao - 1);

  // Calculate the sum of trimmed solve times
  const sum = trimmedSolves.reduce(
    (accumulator, currentValue) => accumulator + currentValue.time,
    0
  );

  // Balance the removed solves (best - worst) to get the average
  result = sum / (ao - 2);

  return result;
}
