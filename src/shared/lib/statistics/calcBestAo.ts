import { Solve } from '@/entities/solve/model/types'

/**
 * Calculates the best average of X (AoX) from a given array of solves.
 * The average is the plain arithmetic mean of 'ao' consecutive solves.
 * Windows containing a DNF are skipped, since a DNF can't be averaged.
 * This function checks all possible windows of 'ao' consecutive solves and returns the best one.
 *
 * @param {Solve[]} solves - An array of Solve objects.
 * @param {number} ao - The desired average length (e.g., 3, 5, 12).
 * @returns {number} The best average of X (AoX) for the given solves.
 */
export default function calcBestAo(solves: Solve[], ao: number): number {
  if (!solves || solves.length < ao || ao < 3) {
    return 0
  }

  const n = solves.length
  let bestAo = Infinity
  let sum = 0
  let dnfCount = 0

  // Sliding window: add the entering solve, drop the leaving one.
  for (let i = 0; i < n; i++) {
    const entering = solves[i]
    if (entering.dnf) dnfCount++
    else sum += entering.time

    if (i >= ao) {
      const leaving = solves[i - ao]
      if (leaving.dnf) dnfCount--
      else sum -= leaving.time
    }

    if (i >= ao - 1 && dnfCount === 0) {
      const currentAo = sum / ao
      if (currentAo < bestAo) bestAo = currentAo
    }
  }

  return bestAo
}
