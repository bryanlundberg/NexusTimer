import { renderHook } from '@testing-library/react'
import { countTurns, isRotation, normalizeReplayMoves } from '@/shared/lib/timer/replayMoves'
import { tryAnalyzeSolution } from '@/shared/lib/tryAnalyzeSolution'
import { useSolveReplayRecorder } from '@/features/timer/model/useSolveReplayRecorder'
import { buildAlgorithmReplay } from '@/features/solve-replay/lib/buildAlgorithmReplay'

describe('isRotation', () => {
  it('matches cube rotations only', () => {
    for (const move of ['x', "x'", 'x2', 'y', "y'", 'y2', 'z', "z'", 'z2']) expect(isRotation(move)).toBe(true)
    for (const move of ['R', "U'", 'M2', 'r', 'Rw', 'E', 'S']) expect(isRotation(move)).toBe(false)
  })
})

describe('countTurns', () => {
  it('skips rotations in strings and timed moves', () => {
    expect(countTurns(['y', 'R', 'U', "x'", "R'"])).toBe(3)
    expect(
      countTurns([
        { m: 'z2', t: 0 },
        { m: 'F', t: 100 }
      ])
    ).toBe(1)
  })
})

describe('normalizeReplayMoves', () => {
  it('pulls an old recording back to its first turn', () => {
    const moves = [
      { m: 'y', t: 0 },
      { m: "x'", t: 0 },
      { m: 'R', t: 12000 },
      { m: 'U', t: 12400 },
      { m: 'y', t: 12900 }
    ]
    expect(normalizeReplayMoves(moves)).toEqual([
      { m: 'y', t: 0 },
      { m: "x'", t: 0 },
      { m: 'R', t: 0 },
      { m: 'U', t: 400 },
      { m: 'y', t: 900 }
    ])
  })

  it('leaves a recording that already starts at the first turn untouched', () => {
    const moves = [
      { m: 'y', t: 0 },
      { m: 'R', t: 0 },
      { m: 'U', t: 400 }
    ]
    expect(normalizeReplayMoves(moves)).toBe(moves)
  })

  it('leaves recordings without leading rotations untouched', () => {
    const moves = [
      { m: 'R', t: 0 },
      { m: 'y', t: 300 },
      { m: 'U', t: 600 }
    ]
    expect(normalizeReplayMoves(moves)).toBe(moves)
  })

  it('leaves an algorithm replay that opens with a rotation untouched', () => {
    const replay = buildAlgorithmReplay("y R U R' U'", '3x3x3', 1100)
    expect(normalizeReplayMoves(replay!.moves)).toBe(replay!.moves)
  })
})

describe('tryAnalyzeSolution', () => {
  it('counts turns only and times them from the first turn', () => {
    const analysis = tryAnalyzeSolution([
      { m: 'y', t: 0 },
      { m: 'R', t: 15000 },
      { m: 'U', t: 15500 },
      { m: "R'", t: 16000 },
      { m: 'x', t: 16200 },
      { m: "U'", t: 16500 }
    ])

    expect(analysis?.moves.map((move) => move.m)).toEqual(['y', 'R', 'U', "R'", 'x', "U'"])
    expect(analysis?.turnCount).toBe(4)
    expect(analysis?.total).toBe(1500)
    expect(analysis?.tps).toBeCloseTo(4 / 1.5)
  })
})

describe('useSolveReplayRecorder', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('starts timing at the first turn, not at an inspection rotation', () => {
    const now = vi.spyOn(performance, 'now')
    const { result } = renderHook(() => useSolveReplayRecorder())

    now.mockReturnValue(1000)
    result.current.record('y', { t: 0 })
    now.mockReturnValue(9000)
    result.current.record('R')
    now.mockReturnValue(9350)
    result.current.record('U')

    expect(result.current.getMoves()).toEqual([
      { m: 'y', t: 0 },
      { m: 'R', t: 0 },
      { m: 'U', t: 350 }
    ])
  })
})
