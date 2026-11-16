import {
  activePhaseIndex,
  buildBarSegments,
  buildPhaseRanges,
  notationGroups
} from '@/features/solve-replay/lib/replayTimeline'
import type { ReplayMarker } from '@/features/solve-replay/model/replayMarker'

const marker = (key: string, moveIndex: number): ReplayMarker => ({
  key,
  name: key.toUpperCase(),
  label: '1.0',
  moveIndex,
  lineClass: `bg-${key}`,
  labelClass: `text-${key}`
})

describe('buildPhaseRanges', () => {
  it('splits moves into contiguous phases and stretches the last one to the end', () => {
    const ranges = buildPhaseRanges([marker('cross', 6), marker('f2l', 30), marker('pll', 40)], 50)
    expect(ranges.map(({ start, end }) => [start, end])).toEqual([
      [0, 6],
      [6, 30],
      [30, 50]
    ])
  })

  it('clamps markers beyond the playback length', () => {
    const ranges = buildPhaseRanges([marker('cross', 8), marker('f2l', 80), marker('pll', 90)], 20)
    expect(ranges.map(({ start, end }) => [start, end])).toEqual([
      [0, 8],
      [8, 20],
      [20, 20]
    ])
  })

  it('returns no ranges without markers or moves', () => {
    expect(buildPhaseRanges([], 10)).toEqual([])
    expect(buildPhaseRanges([marker('cross', 3)], 0)).toEqual([])
  })
})

describe('buildBarSegments', () => {
  it('maps ranges to percentages of the bar', () => {
    const segments = buildBarSegments(buildPhaseRanges([marker('a', 5), marker('b', 10)], 20), 20)
    expect(segments).toEqual([
      { key: 'a', left: 0, width: 25, colorClass: 'bg-a' },
      { key: 'b', left: 25, width: 75, colorClass: 'bg-b' }
    ])
  })
})

describe('activePhaseIndex', () => {
  const ranges = buildPhaseRanges([marker('a', 5), marker('b', 10)], 20)

  it('follows the phase of the next move to play', () => {
    expect(activePhaseIndex(ranges, 0)).toBe(0)
    expect(activePhaseIndex(ranges, 4)).toBe(0)
    expect(activePhaseIndex(ranges, 5)).toBe(1)
    expect(activePhaseIndex(ranges, 20)).toBe(1)
  })

  it('is -1 without phases', () => {
    expect(activePhaseIndex([], 3)).toBe(-1)
  })
})

describe('notationGroups', () => {
  it('locates trigger groups by move index', () => {
    expect(notationGroups("R U R' U' F", 5)).toEqual([{ start: 0, end: 4 }])
  })

  it('keeps explicit parenthesised groups', () => {
    expect(notationGroups("F (R U R') U'", 5)).toEqual([{ start: 1, end: 4 }])
  })

  it('gives up when the notation does not match the playback moves', () => {
    expect(notationGroups("R U R' U'", 3)).toEqual([])
  })
})
