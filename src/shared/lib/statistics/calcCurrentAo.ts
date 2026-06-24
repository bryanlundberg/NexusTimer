import { Solve } from '@/entities/solve/model/types'
import { calcAoFromWindow } from './getAoTolerance'

/**
 * Calculates the current average of X (AoX) from a given array of solves.
 * DNFs are removed and the remaining times averaged, as long as the number of
 * DNFs stays within the tolerance for that average length (see getAoTolerance).
 * If there are more DNFs than tolerated, the average is DNF (represented as 0).
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

  // Average the most recent 'ao' solves using the shared DNF tolerance rule
  return calcAoFromWindow(solves.slice(0, ao), ao)
}
