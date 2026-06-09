import { Solve } from '@/entities/solve/model/types'

/**
 * Calculates the current average of X (AoX) from a given array of solves.
 * The average is the plain arithmetic mean of the most recent 'ao' solves.
 * If any of them is a DNF, the average is DNF (represented as 0), since a DNF can't be averaged.
 *
 * @param {Solve[]} solves - An array of Solve objects.
 * @param {number} ao - The desired average length (e.g., 3, 5, 12).
 * @returns {number} The current average of X (AoX) for the given solves.
 */
export default function calcCurrentAo(solves: Solve[], ao: number): number {
  if (ao <= 2) {
    return 0
  }
  // If the number of solves is less than the desired average length, return 0
  if (!solves || solves.length < ao) {
    return 0
  }

  // Get the most recent 'ao' solves
  const aoSolves = solves.slice(0, ao)

  // A DNF can't be averaged, so the average is DNF (represented as 0)
  if (aoSolves.some((solve) => solve.dnf)) {
    return 0
  }

  const sum = aoSolves.reduce((total, solve) => total + solve.time, 0)

  return sum / ao
}
