import formatTime from '@/shared/lib/formatTime'
import type { AoWindowSolve } from '@/entities/user-stats/model/types'

export interface Ao5Edges {
  bestId: string
  worstId: string
}

export function ao5EdgesOf(window: AoWindowSolve[] | null | undefined): Ao5Edges | null {
  if (!window?.length) return null
  const sorted = [...window].sort((a, b) => (a.dnf ? Infinity : a.time) - (b.dnf ? Infinity : b.time))
  return { bestId: sorted[0].id, worstId: sorted[sorted.length - 1].id }
}

export function formatAo5Window(window: AoWindowSolve[], edges: Ao5Edges): string {
  const labels = window.map((solve) => {
    const label = solve.dnf ? 'DNF' : `${formatTime(solve.time)}${solve.plus2 ? '+' : ''}`
    return solve.id === edges.bestId || solve.id === edges.worstId ? `(${label})` : label
  })
  return `[${labels.join(' ')}]`
}
