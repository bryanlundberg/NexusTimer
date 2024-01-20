import { Solve } from "@/interfaces/Solve";

/**
 * Calculates the standard deviation of solve times.
 * @param {Solve[]} solves - An array of Solve objects.
 * @returns {number} The standard deviation of solve times. Returns 0 if there are less than 2 solves.
 */
export default function getDeviation(solves: Solve[]): number {
  if (!solves) return 0;

  // If there are less than 2 solves, the standard deviation is 0.
  if (solves.length < 2) {
    return 0;
  }

  const n = solves.length;

  // Calculate the mean (average) of solve times.
  const totalSolves = solves.reduce(
    (accumulator, solve) => accumulator + solve.time,
    0
  );
  const mean = totalSolves / n;

  // Calculate the sum of squared differences from the mean.
  const diffSquaredSum = solves.reduce((accumulator, solve) => {
    const difference = solve.time - mean;
    return accumulator + difference ** 2;
  }, 0);

  // Calculate the standard deviation.
  const standardDeviation = Math.sqrt(diffSquaredSum / (n - 1));

  return standardDeviation;
}
