import { Solve } from "@/interfaces/Solve";

/**
 * Calculates the mean (average) of solve times.
 * @param {Solve[]} solves - An array of Solve objects.
 * @returns {number} The mean of solve times. Returns 0 if there are no solves.
 */
export default function getMean(solves: Solve[]): number {
  if (!solves) return 0;
  const n = solves.length;

  // If there are no solves, the mean is 0.
  if (n === 0) {
    return 0;
  }

  // Calculate the sum of solve times using a simple loop.
  let totalSolvingTime = 0;
  for (let i = 0; i < n; i++) {
    totalSolvingTime += solves[i].time;
  }

  // Calculate the mean, avoiding division if there is only one solve.
  const mean = n === 1 ? totalSolvingTime : totalSolvingTime / n;

  return mean;
}
