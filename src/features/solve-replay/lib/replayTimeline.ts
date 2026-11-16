import { parseNotation } from '@/shared/lib/parseNotation'
import type { ReplayMarker } from '@/features/solve-replay/model/replayMarker'

export interface BarSegment {
  key: string
  left: number
  width: number
  colorClass: string
}

export interface PhaseRange {
  key: string
  name: string
  label: string
  start: number
  end: number
  lineClass: string
  labelClass: string
}

export interface MoveSpan {
  start: number
  end: number
}

const clamp = (n: number, total: number) => Math.max(0, Math.min(n, total))

export function buildPhaseRanges(markers: readonly ReplayMarker[], total: number): PhaseRange[] {
  if (!markers.length || total === 0) return []
  let start = 0
  return markers.map((marker, i) => {
    const end = i < markers.length - 1 ? Math.max(start, clamp(marker.moveIndex, total)) : total
    const range = {
      key: marker.key,
      name: marker.name ?? marker.key,
      label: marker.label,
      start,
      end,
      lineClass: marker.lineClass,
      labelClass: marker.labelClass
    }
    start = end
    return range
  })
}

export function buildBarSegments(ranges: readonly PhaseRange[], total: number): BarSegment[] {
  if (total === 0) return []
  return ranges.map((range) => ({
    key: range.key,
    left: (range.start / total) * 100,
    width: ((range.end - range.start) / total) * 100,
    colorClass: range.lineClass
  }))
}

export function activePhaseIndex(ranges: readonly PhaseRange[], index: number): number {
  if (!ranges.length) return -1
  const next = ranges.findIndex((range) => index >= range.start && index < range.end)
  return next === -1 ? ranges.length - 1 : next
}

export function notationGroups(alg: string, moveCount: number): MoveSpan[] {
  const tokens = parseNotation(alg)
  const sizes = tokens.map((token) => (token.type === 'group' ? token.moves.length : 1))
  if (sizes.reduce((sum, size) => sum + size, 0) !== moveCount) return []

  const groups: MoveSpan[] = []
  let start = 0
  tokens.forEach((token, i) => {
    if (token.type === 'group') groups.push({ start, end: start + sizes[i] })
    start += sizes[i]
  })
  return groups
}
