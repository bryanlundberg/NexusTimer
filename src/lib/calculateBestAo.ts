import { Solve } from "@/interfaces/Solve";

/**
 * Calculates the best average of X (AoX) from a given array of solves.
 * @param {Solve[]} solves - An array of Solve objects.
 * @param {number} ao - The desired average length (e.g., 3, 5, 12).
 * @returns {number} The best average of X (AoX) for the given solves.
 */
export default function calculateBestAo(solves: Solve[], ao: number): number {
  // If the number of solves is less than the desired average, return 0
  if (!solves || solves.length < ao) {
    return 0;
  }

  const n = solves.length;
  let bestAo = Infinity;

  for (let i = 0; i <= n - ao; i++) {
    let sum = 0;
    let minTime = Infinity;
    let maxTime = -Infinity;

    // Calculate the sum of solve times and find the min and max time in the range
    for (let j = i; j < i + ao; j++) {
      const time = solves[j].time;
      sum += time;
      if (time < minTime) {
        minTime = time;
      }
      if (time > maxTime) {
        maxTime = time;
      }
    }

    // Adjust the sum by removing the min and max time
    sum -= minTime + maxTime;

    // Calculate the adjusted average
    const currentAo = sum / (ao - 2);
    bestAo = Math.min(bestAo, currentAo);
  }

  return bestAo;
}
