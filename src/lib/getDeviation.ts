import { Solve } from '@/entities/solve/model/types'

/**
 * Calculates the standard deviation of solved times.
 * @param {Solve[]} solves - An array of Solve objects.
 * @returns {number} The standard deviation of solved times. Returns 0 if there are less than 2 solves.
 */
export default function getDeviation(solves: Solve[]): number {
  if (!solves) {
    return 0
  }

  const allSolves = [...solves]

  // If there are less than 2 solves, the standard deviation is 0.
  if (allSolves.length < 2) {
    return 0
  }

  const n = allSolves.length

  // Calculate the mean (average) of all solve times.
  const totalSolves = allSolves.reduce((accumulator, solve) => accumulator + solve.time, 0)
  const mean = totalSolves / n

  // Calculate the sum of squared differences from the mean.
  const diffSquaredSum = allSolves.reduce((accumulator, solve) => {
    const difference = solve.time - mean
    return accumulator + difference ** 2
  }, 0)

  // Calculate the standard deviation using n instead of n-1 to match the expected result.
  return Math.sqrt(diffSquaredSum / n)
}
