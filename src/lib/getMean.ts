import { Solve } from "@/interfaces/Solve";

/**
 * Calculates the mean (average) of solve times.
 * @param {Solve[]} solves - An array of Solve objects.
 * @returns {number} The mean of solve times.
 */
export default function getMean(solves: Solve[]): number {
  // If there are no solves, the mean is 0.
  if (solves.length < 1) {
    return 0;
  }

  const n = solves.length;

  // Calculate the sum of solve times.
  const totalSolvingTime = solves.reduce(
    (accumulator, solve) => accumulator + solve.time,
    0
  );

  // Calculate the mean.
  const mean = totalSolvingTime / n;

  return mean;
}
