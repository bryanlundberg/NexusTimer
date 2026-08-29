import { Alg } from '@rednaxela101/cubing/alg'
import { puzzles } from '@rednaxela101/cubing/puzzles'
import { buildAlgorithmReplay } from '@/features/solve-replay/lib/buildAlgorithmReplay'
import { cleanMoves, invertAlgorithm, isSquare1Alg } from '@/features/trainer/lib/trainerUtils'
import { ALGORITHM_SETS } from '@/shared/const/algorithms-sets'

const MOVE_MS = 1100

describe('isSquare1Alg', () => {
  it('detects Square-1 tuples', () => {
    expect(isSquare1Alg('/ (3,0) / (-1,1)')).toBe(true)
    expect(isSquare1Alg('(1,0) / (-1,0)')).toBe(true)
  })

  it('does not treat NxN grouping parentheses as Square-1', () => {
    expect(isSquare1Alg("(R U R' U')")).toBe(false)
    expect(isSquare1Alg("R U R' U' R' F R F'")).toBe(false)
  })
})

describe('buildAlgorithmReplay', () => {
  it('expands Square-1 tuples into the moves the player can animate', () => {
    const replay = buildAlgorithmReplay('/ (3,0) / (-1,1)', 'square1', MOVE_MS)

    // A `(x,y)` tuple is a grouping, not a move: `experimentalAddMove` ignores it,
    // which is why only the `/` slices used to turn. The `0` half is dropped.
    expect(replay?.moves.map((move) => move.m)).toEqual(['/', 'U_SQ_3', '/', "U_SQ_'", 'D_SQ_'])
  })

  it('opens on the case so playing the algorithm solves it', () => {
    // Same state the thumbnail shows: the inverted alg, plus the yellow-layer
    // rotation on the puzzles that get one.
    expect(buildAlgorithmReplay('/ (3,0) / (-1,1)', 'square1', MOVE_MS)?.scramble).toBe('(1, -1) / (-3, 0) /')
    expect(buildAlgorithmReplay("R U R' U'", '3x3x3', MOVE_MS)?.scramble).toBe("z2 U R U' R'")
    expect(buildAlgorithmReplay("R U R' U'", '5x5x5', MOVE_MS)?.scramble).toBe("U R U' R'")
  })

  it('leaves the puzzle in the same state as the original Square-1 alg', async () => {
    const kpuzzle = await puzzles['square1'].kpuzzle()

    for (const alg of ['/ (3,0) / (-1,1)', '(1,0) / (-3,-3) / (0,2)', '(0,-1) / (1,1) / (-1,0)']) {
      const replay = buildAlgorithmReplay(alg, 'square1', MOVE_MS)
      const played = new Alg(replay!.moves.map((move) => move.m).join(' '))

      expect(
        kpuzzle
          .defaultPattern()
          .applyAlg(played)
          .isIdentical(kpuzzle.defaultPattern().applyAlg(new Alg(alg)))
      ).toBe(true)
    }
  })

  it('ends solved after playing a Square-1 preview from its scramble', async () => {
    const kpuzzle = await puzzles['square1'].kpuzzle()

    for (const alg of ['/ (3,0) / (-1,1)', '(1,0) / (-3,-3) / (0,2)', '(0,-1) / (1,1) / (-1,0)']) {
      const replay = buildAlgorithmReplay(alg, 'square1', MOVE_MS)!
      const played = new Alg([replay.scramble, ...replay.moves.map((move) => move.m)].join(' '))

      expect(kpuzzle.defaultPattern().applyAlg(played).isIdentical(kpuzzle.defaultPattern())).toBe(true)
    }
  })

  it('still flattens NxN grouping parentheses into single moves', () => {
    const replay = buildAlgorithmReplay("(R U R' U')", '3x3x3', MOVE_MS)

    expect(replay?.moves.map((move) => move.m)).toEqual(['R', 'U', "R'", "U'"])
  })

  it('returns null instead of throwing on an alg that does not parse', () => {
    expect(buildAlgorithmReplay('1,0 / -1,0', 'square1', MOVE_MS)).toBeNull()
    expect(buildAlgorithmReplay('', '3x3x3', MOVE_MS)).toBeNull()
  })

  it('builds a replay for every algorithm shipped in ALGORITHM_SETS', () => {
    const failures: string[] = []

    for (const set of ALGORITHM_SETS) {
      for (const collection of set.algorithms) {
        for (const alg of collection.algs) {
          if (!buildAlgorithmReplay(alg.moves, set.puzzle, MOVE_MS)) {
            failures.push(`${set.slug} / ${collection.name}: ${alg.moves}`)
          }
        }
        if (collection.setup) {
          try {
            cleanMoves(collection.setup)
            invertAlgorithm(collection.setup)
          } catch {
            failures.push(`${set.slug} / ${collection.name} setup: ${collection.setup}`)
          }
        }
      }
    }

    expect(failures).toEqual([])
  })
})
