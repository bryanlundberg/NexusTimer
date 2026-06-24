import { Solve } from '@/entities/solve/model/types'
import getAoTolerance from './getAoTolerance'

/**
 * Calculates the best average of X (AoX) from a given array of solves.
 * The average is the plain arithmetic mean of 'ao' consecutive solves, where
 * DNFs are removed and the remaining times averaged. A window is only valid when
 * its number of DNFs stays within the tolerance for that average length (see
 * getAoTolerance); windows with too many DNFs are skipped.
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
  const tolerance = getAoTolerance(ao)
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

    if (i >= ao - 1 && dnfCount <= tolerance) {
      const validCount = ao - dnfCount
      if (validCount > 0) {
        const currentAo = sum / validCount
        if (currentAo < bestAo) bestAo = currentAo
      }
    }
  }

  return bestAo
}
