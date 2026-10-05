import type { Solve } from './types'

export function getAoTolerance(ao: number): number {
  if (ao < 5) return 0
  return Math.ceil(ao / 20)
}

export function calcAoFromWindow(window: Solve[], ao: number): number {
  if (!window || window.length < ao || ao < 3) return 0

  const trim = getAoTolerance(ao)

  const dnfCount = window.reduce((count, solve) => (solve.dnf ? count + 1 : count), 0)
  if (dnfCount > trim) return 0

  const sorted = [...window].sort((a, b) => (a.dnf ? Infinity : a.time) - (b.dnf ? Infinity : b.time))
  const kept = sorted.slice(trim, ao - trim)
  if (kept.length === 0) return 0

  return kept.reduce((total, solve) => total + solve.time, 0) / kept.length
}
