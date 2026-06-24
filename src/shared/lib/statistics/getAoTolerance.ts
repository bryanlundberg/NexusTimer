import { Solve } from '@/entities/solve/model/types'

/**
 * Maximum number of DNF solves tolerated inside an AoX before the whole average
 * itself becomes a DNF. Within the tolerance the DNFs are removed and the
 * remaining times are averaged; above it the average can't be computed.
 */
export const AO_DNF_TOLERANCE: Record<number, number> = {
  3: 0,
  5: 1,
  12: 2,
  50: 5,
  100: 10,
  1000: 25
}

/**
 * Returns the DNF tolerance for a given average length. Lengths that aren't
 * explicitly mapped don't tolerate any DNF.
 *
 * @param {number} ao - The average length (e.g., 3, 5, 12).
 * @returns {number} The maximum number of DNFs allowed in the average.
 */
export default function getAoTolerance(ao: number): number {
  return AO_DNF_TOLERANCE[ao] ?? 0
}

/**
 * Computes the average of a single window of solves following the DNF tolerance
 * rule: DNFs are removed and the rest averaged, unless the number of DNFs
 * exceeds the tolerance for that average length, in which case it's a DNF.
 *
 * @param {Solve[]} window - Exactly `ao` solves to average.
 * @param {number} ao - The average length (e.g., 3, 5, 12).
 * @returns {number} The average, 0 when it can't be computed, or DNF.
 */
export function calcAoFromWindow(window: Solve[], ao: number): number {
  if (!window || window.length < ao || ao < 3) return 0

  const dnfCount = window.reduce((count, solve) => (solve.dnf ? count + 1 : count), 0)
  if (dnfCount > getAoTolerance(ao)) return 0

  const valid = window.filter((solve) => !solve.dnf)
  if (valid.length === 0) return 0

  const sum = valid.reduce((total, solve) => total + solve.time, 0)
  return sum / valid.length
}
