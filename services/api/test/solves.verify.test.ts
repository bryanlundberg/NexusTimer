import type { SubmitSolveInput } from '@nexustimer/contracts'
import { describe, expect, it } from 'vitest'
import { verifyLeaderboardSolve } from '../src/modules/solves/solves.verify'

const SCRAMBLE = "R U R' U' F2 D"
const SOLUTION = ["D'", 'F2', 'U', 'R', "U'", "R'"]

function solve(overrides: Partial<SubmitSolveInput> = {}, moves = SOLUTION.map((m, i) => ({ m, t: i * 1000 }))) {
  const durationMs = moves.at(-1)?.t ?? 0
  return {
    time: durationMs,
    scramble: SCRAMBLE,
    puzzle: '3x3x3',
    replay: { version: 1, puzzle: '3x3x3', scramble: SCRAMBLE, durationMs, moves },
    ...overrides
  } satisfies SubmitSolveInput
}

describe('verifyLeaderboardSolve', () => {
  it('accepts a replay that solves the scramble', () => {
    expect(verifyLeaderboardSolve(solve())).toBe(true)
  })

  it('accepts inspection rotations and a solve that ends in another orientation', () => {
    const moves = ['y', "D'", 'L2', 'U', 'F', "U'", "F'", 'x'].map((m, i) => ({ m, t: m === 'y' ? 0 : i * 1000 }))

    expect(verifyLeaderboardSolve(solve({}, moves))).toBe(true)
  })

  it('accepts a +2 on top of the replay duration', () => {
    const base = solve()
    expect(verifyLeaderboardSolve({ ...base, time: base.replay.durationMs + 2000 })).toBe(true)
  })

  it('accepts a 2x2 solve', () => {
    const base = solve()
    expect(verifyLeaderboardSolve({ ...base, puzzle: '2x2x2', replay: { ...base.replay, puzzle: '2x2x2' } })).toBe(true)
  })

  it('rejects a replay that leaves the cube unsolved', () => {
    expect(
      verifyLeaderboardSolve(
        solve(
          {},
          SOLUTION.slice(1).map((m, i) => ({ m, t: i * 1000 }))
        )
      )
    ).toBe(false)
  })

  it('rejects a scramble that is already solved', () => {
    expect(
      verifyLeaderboardSolve(
        solve({ scramble: "R R'" }, [
          { m: 'U', t: 0 },
          { m: "U'", t: 100 }
        ])
      )
    ).toBe(false)
  })

  it('rejects a time that does not match the replay', () => {
    expect(verifyLeaderboardSolve({ ...solve(), time: 1000 })).toBe(false)
  })

  it('rejects a replay duration far from its last move', () => {
    const base = solve()
    const durationMs = base.replay.durationMs + 5000
    expect(verifyLeaderboardSolve({ ...base, time: durationMs, replay: { ...base.replay, durationMs } })).toBe(false)
  })

  it('rejects move times that go backwards', () => {
    const moves = SOLUTION.map((m, i) => ({ m, t: i === 3 ? 100 : i * 1000 }))
    expect(verifyLeaderboardSolve(solve({}, moves))).toBe(false)
  })

  it('rejects a replay for another scramble or puzzle', () => {
    const base = solve()
    expect(verifyLeaderboardSolve({ ...base, replay: { ...base.replay, scramble: "R U R'" } })).toBe(false)
    expect(verifyLeaderboardSolve({ ...base, puzzle: '2x2x2' })).toBe(false)
  })
})
