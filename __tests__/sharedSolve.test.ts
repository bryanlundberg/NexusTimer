import { generateSlug, isValidSlug, SLUG_LENGTH } from '@/entities/shared-solve/lib/slug'
import { REPLAY_MAX_MOVES, shareSolveSchema } from '@/entities/shared-solve/model/types'
import { toShareInput } from '@/features/share-solve/api/sharedSolvesApi'
import type { Solve } from '@/entities/solve/model/types'

const baseSolve: Solve = {
  id: 'local-1',
  cubeId: 'cube-1',
  scramble: "R U R' U'",
  startTime: 1_700_000_000_000,
  endTime: 1_700_000_009_043,
  bookmark: false,
  time: 9043,
  rating: 0,
  dnf: false,
  plus2: false
}

describe('shared solve slug', () => {
  it('generates base62 slugs of the expected length', () => {
    for (let i = 0; i < 500; i++) {
      const slug = generateSlug()
      expect(slug).toHaveLength(SLUG_LENGTH)
      expect(isValidSlug(slug)).toBe(true)
    }
  })

  it('does not repeat across many generations', () => {
    const slugs = new Set(Array.from({ length: 5000 }, generateSlug))
    expect(slugs.size).toBe(5000)
  })

  it('rejects malformed slugs', () => {
    for (const value of ['', 'abc', 'abcdefghijk', 'abc-efghij', 'abc_efghij', '../etc/pas', 42, null, undefined]) {
      expect(isValidSlug(value)).toBe(false)
    }
  })
})

describe('shareSolveSchema', () => {
  it('accepts the payload built from a local solve', () => {
    expect(shareSolveSchema.safeParse(toShareInput(baseSolve, '3x3')).success).toBe(true)
  })

  it('drops replays longer than the move cap', () => {
    const moves = Array.from({ length: REPLAY_MAX_MOVES + 1 }, (_, i) => ({ m: 'R', t: i }))
    const solve: Solve = {
      ...baseSolve,
      replay: { version: 1, puzzle: '3x3x3', scramble: baseSolve.scramble, durationMs: 9043, moves }
    }
    expect(toShareInput(solve, '3x3').replay).toBeUndefined()
  })

  it('accepts smart cube replays with fractional timings', () => {
    const solve: Solve = {
      ...baseSolve,
      time: 9043.299999,
      replay: {
        version: 1,
        puzzle: '3x3x3',
        scramble: baseSolve.scramble,
        durationMs: 9043.299999,
        moves: [
          { m: 'R', t: 0 },
          { m: "U'", t: 412.6 }
        ]
      }
    }
    const input = toShareInput(solve, '3x3')
    expect(input.replay?.durationMs).toBe(9043)
    expect(input.replay?.moves[1].t).toBe(413)
    expect(shareSolveSchema.safeParse(input).success).toBe(true)
  })

  it('rejects unknown puzzles and extra fields', () => {
    const input = toShareInput(baseSolve, '3x3')
    expect(shareSolveSchema.safeParse({ ...input, puzzle: '9x9' }).success).toBe(false)
    expect(shareSolveSchema.safeParse({ ...input, user: 'someone-else' }).success).toBe(false)
  })
})
