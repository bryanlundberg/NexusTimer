import { Solve } from '@/entities/solve/model/types'

/**
 * Calculates the current average of X (AoX) from a given array of solves.
 * For averages, the best and worst times are removed, and the average of the remaining times is calculated.
 * DNF solves are always considered the worst times. If there is more than one DNF, the average is DNF (represented as 0).
 * If a DNF remains after removing the best and worst times, the average is DNF.
 *
 * @param {Solve[]} solves - An array of Solve objects.
 * @param {number} ao - The desired average length (e.g., 3, 5, 12).
 * @returns {number} The current average of X (AoX) for the given solves.
 */
export default function calculateCurrentAo(solves: Solve[], ao: number): number {
  if (ao <= 2) {
    return 0
  }
  // If the number of solves is less than the desired average length, return 0
  if (!solves || solves.length < ao) {
    return 0
  }

  // Get the most recent 'ao' solves
  const aoSolves = solves.slice(0, ao)

  // Count DNFs
  const dnfCount = aoSolves.filter((solve) => solve.dnf).length

  // If more than one DNF, the average is DNF (represented as 0)
  if (dnfCount > 1) {
    return 0
  }

  // Sort solves by time, treating DNFs as worst times
  const sortedSolves = [...aoSolves].sort((a, b) => {
    if (a.dnf) return 1
    if (b.dnf) return -1
    return a.time - b.time
  })

  // Remove the best and worst time from the array to trim the average
  const trimmedSolves = sortedSolves.slice(1, ao - 1)

  // Calculate the sum of trimmed solve times
  let sum = 0
  let validCount = 0
  for (let i = 0; i < trimmedSolves.length; i++) {
    if (trimmedSolves[i].dnf) {
      // If there's a DNF in the trimmed solves, the average is DNF
      return 0
    }
    sum += trimmedSolves[i].time
    validCount++
  }

  // Calculate the average of the trimmed solves
  return sum / validCount
}
