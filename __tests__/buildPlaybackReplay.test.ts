import { buildPlaybackReplay } from '@/features/solve-replay/lib/buildPlaybackReplay'
import { buildAlgorithmReplay } from '@/features/solve-replay/lib/buildAlgorithmReplay'
import type { SolveReplay } from '@/entities/replay/model/types'

const SCRAMBLE = "R U R' U'"

function solveReplay(moves: SolveReplay['moves']): SolveReplay {
  return { version: 1, puzzle: '3x3x3', scramble: SCRAMBLE, durationMs: 900, moves }
}

describe('buildPlaybackReplay', () => {
  it('moves inspection rotations into the setup and starts on the first turn', () => {
    const { replay, skipped } = buildPlaybackReplay(
      solveReplay([
        { m: 'y', t: 0 },
        { m: "x'", t: 0 },
        { m: 'y2', t: 0 },
        { m: 'R', t: 0 },
        { m: 'U', t: 400 },
        { m: 'z', t: 600 },
        { m: "R'", t: 900 }
      ])
    )

    expect(skipped).toBe(3)
    expect(replay.scramble).toBe(`${SCRAMBLE} y x' y2`)
    expect(replay.moves).toEqual([
      { m: 'R', t: 0 },
      { m: 'U', t: 400 },
      { m: 'z', t: 600 },
      { m: "R'", t: 900 }
    ])
  })

  it('also starts old recordings on the first turn', () => {
    const { replay, skipped } = buildPlaybackReplay(
      solveReplay([
        { m: 'y', t: 0 },
        { m: 'R', t: 14000 },
        { m: 'U', t: 14400 }
      ])
    )

    expect(skipped).toBe(1)
    expect(replay.moves).toEqual([
      { m: 'R', t: 0 },
      { m: 'U', t: 400 }
    ])
  })

  it('keeps a solve without inspection rotations as it is', () => {
    const source = solveReplay([
      { m: 'R', t: 0 },
      { m: 'y', t: 300 },
      { m: 'U', t: 600 }
    ])
    expect(buildPlaybackReplay(source)).toEqual({ replay: source, skipped: 0 })
    expect(buildPlaybackReplay(source).replay).toBe(source)
  })

  it('keeps an algorithm replay that opens with a rotation as it is', () => {
    const source = buildAlgorithmReplay("y R U R' U'", '3x3x3', 1100)!
    expect(buildPlaybackReplay(source).replay).toBe(source)
  })

  it('keeps a replay made only of rotations playable', () => {
    const source = solveReplay([
      { m: 'y', t: 0 },
      { m: 'x', t: 0 }
    ])
    expect(buildPlaybackReplay(source)).toEqual({ replay: source, skipped: 0 })
  })
})
