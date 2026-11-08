import { square1, type Square1State } from '@nexustimer/cubelet/square1'
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
  it('keeps each Square-1 tuple as one move so both layers turn together', () => {
    const replay = buildAlgorithmReplay('/ (3,0) / (-1,1)', 'square1', MOVE_MS)

    expect(replay?.moves.map((move) => move.m)).toEqual(['/', '(3,0)', '/', '(-1,1)'])
  })

  it('opens on the case so playing the algorithm solves it', () => {
    expect(buildAlgorithmReplay('/ (3,0) / (-1,1)', 'square1', MOVE_MS)?.scramble).toBe('(1, -1) / (-3, 0) /')
    expect(buildAlgorithmReplay("R U R' U'", '3x3x3', MOVE_MS)?.scramble).toBe("z2 U R U' R'")
    expect(buildAlgorithmReplay("R U R' U'", '5x5x5', MOVE_MS)?.scramble).toBe("U R U' R'")
  })

  it('ends solved when every Square-1 preview is played move by move from its scramble', () => {
    const failures: string[] = []

    for (const set of ALGORITHM_SETS.filter((entry) => entry.puzzle === 'square1')) {
      for (const collection of set.algorithms) {
        for (const alg of collection.algs) {
          const replay = buildAlgorithmReplay(alg.moves, 'square1', MOVE_MS)!
          try {
            const end = replay.moves.reduce<Square1State>(
              (state, move) => state.apply(square1.compile(move.m)),
              square1.solved().apply(square1.compile(replay.scramble))
            )
            if (!end.isSolved()) failures.push(`${set.slug} / ${collection.name}: ${alg.moves}`)
          } catch {
            failures.push(`${set.slug} / ${collection.name}: ${alg.moves} (rejected)`)
          }
        }
      }
    }

    expect(failures).toEqual([])
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
