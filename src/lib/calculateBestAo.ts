import { Solve } from "@/interfaces/Solve";

/**
 * Calculates the best average of X (AoX) from a given array of solves.
 * @param {Solve[]} solves - An array of Solve objects.
 * @param {number} ao - The desired average length (e.g., 3, 5, 12).
 * @returns {number} The best average of X (AoX) for the given solves.
 */
export default function calculateBestAo(solves: Solve[], ao: number): number {
  // If the number of solves is less than the desired average length, return 0
  if (!solves || solves.length < ao) {
    return 0;
  }

  const n = solves.length;
  let bestAo = Infinity;

  for (let i = 0; i <= n - ao; i++) {
    let sum = 0;

    // Calculate the sum of solve times directly in the loop
    for (let j = i; j < i + ao; j++) {
      sum += solves[j].time;
    }

    // Calculate the current AoX and update the bestAo if needed
    const currentAo = sum / ao;
    bestAo = Math.min(bestAo, currentAo);
  }

  return bestAo;
}
