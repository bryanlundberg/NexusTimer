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
export default function calcBestAo(solves: Solve[], ao: number): number {
  if (!solves || solves.length < ao || ao < 3) {
    return 0
  }

  const n = solves.length
  const divisor = ao - 2
  let bestAo = Infinity

  for (let i = 0; i <= n - ao; i++) {
    let minTime = Infinity
    let maxTime = -Infinity
    let sum = 0
    let dnfCount = 0

    for (let j = i; j < i + ao; j++) {
      const solve = solves[j]
      if (solve.dnf) {
        dnfCount++
        if (dnfCount > 1) break
        continue
      }
      sum += solve.time
      if (solve.time < minTime) minTime = solve.time
      if (solve.time > maxTime) maxTime = solve.time
    }

    if (dnfCount > 1) continue

    // DNF (if present) is treated as the worst, so it's already excluded from `sum`.
    // We still need to drop the best real time. With no DNF, we also drop the worst real time.
    const trimmedSum = dnfCount === 1 ? sum - minTime : sum - minTime - maxTime
    const currentAo = trimmedSum / divisor
    if (currentAo < bestAo) bestAo = currentAo
  }

  return bestAo
}
