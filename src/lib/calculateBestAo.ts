import { Solve } from '@/entities/solve/model/types'

/**
 * Calculates the best average of X (AoX) from a given array of solves.
 * For averages, the best and worst times are removed, and the average of the remaining times is calculated.
 * DNF solves are always considered the worst times. If there is more than one DNF, the average is DNF (represented as 0).
 * If a DNF remains after removing the best and worst times, the average is DNF.
 * This function checks all possible windows of 'ao' consecutive solves and returns the best one.
 *
 * @param {Solve[]} solves - An array of Solve objects.
 * @param {number} ao - The desired average length (e.g., 3, 5, 12).
 * @returns {number} The best average of X (AoX) for the given solves.
 */
export default function calculateBestAo(solves: Solve[], ao: number): number {
  // If the number of solves is less than the desired average, return 0
  if (!solves || solves.length < ao) {
    return 0
  }

  const n = solves.length
  let bestAo = Infinity

  for (let i = 0; i <= n - ao; i++) {
    // Get the current window of solves
    const windowSolves = solves.slice(i, i + ao)

    // Count DNFs in the window
    const dnfCount = windowSolves.filter((solve) => solve.dnf).length

    // If more than one DNF, this window's average is DNF, so skip it
    if (dnfCount > 1) {
      continue
    }

    // Sort solves by time, treating DNFs as worst times
    const sortedSolves = [...windowSolves].sort((a, b) => {
      if (a.dnf) return 1
      if (b.dnf) return -1
      return a.time - b.time
    })

    // Remove the best and worst time from the array
    const trimmedSolves = sortedSolves.slice(1, ao - 1)

    // Check if there's a DNF in the trimmed solves
    if (trimmedSolves.some((solve) => solve.dnf)) {
      // If there's a DNF in the trimmed solves, this window's average is DNF, so skip it
      continue
    }

    // Calculate the sum of trimmed solve times
    let sum = 0
    let validCount = 0
    for (const solve of trimmedSolves) {
      sum += solve.time
      validCount++
    }

    // Calculate the average of the trimmed solves
    const currentAo = sum / validCount
    bestAo = Math.min(bestAo, currentAo)
  }

  return bestAo
}
