import type { SubmitSolveInput } from '@nexustimer/contracts'
import { describe, expect, it, vi } from 'vitest'
import type { NewSolve } from '../src/modules/solves/solves.repository'
import { cleanRotations, createSolvesService, type SolvesService } from '../src/modules/solves/solves.service'
import { buildTestApp, testSessions } from './helpers'

const USER = '64b7f0c2a1b2c3d4e5f60718'

const input: SubmitSolveInput = {
  time: 9431,
  scramble: "R U R' U' F2 D",
  puzzle: '3x3x3',
  smart: true,
  solution: "x y R U R' U' y",
  replay: { version: 1, puzzle: '3x3x3', scramble: "R U R' U' F2 D", durationMs: 9431, moves: [{ m: 'R', t: 120 }] }
}

describe('cleanRotations', () => {
  it('drops the inspection rotations and keeps the ones inside the solution', () => {
    expect(cleanRotations("  x y' R U x2 y  ")).toBe('R U x2 y')
    expect(cleanRotations("z x' y")).toBe('')
    expect(cleanRotations("R U R'")).toBe("R U R'")
  })
})

describe('solves service', () => {
  it('stores the leaderboard solve with a cleaned solution', async () => {
    const insert = vi.fn<(solve: NewSolve) => Promise<void>>(async () => {})

    await createSolvesService({ repository: { insert } }).submit(USER, input)

    expect(insert).toHaveBeenCalledWith({
      userId: USER,
      time: 9431,
      scramble: "R U R' U' F2 D",
      solution: "R U R' U' y",
      puzzle: '3x3x3',
      smart: true,
      replay: input.replay
    })
  })

  it('stores nulls for a missing solution and replay and treats a missing smart flag as false', async () => {
    const insert = vi.fn<(solve: NewSolve) => Promise<void>>(async () => {})

    await createSolvesService({ repository: { insert } }).submit(USER, {
      time: 4012,
      scramble: "R U R'",
      puzzle: '2x2x2'
    })

    expect(insert).toHaveBeenCalledWith({
      userId: USER,
      time: 4012,
      scramble: "R U R'",
      solution: null,
      puzzle: '2x2x2',
      smart: false,
      replay: null
    })
  })
})

describe('solves route', () => {
  const post = (body: unknown) => ({
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(body)
  })

  function appWith(submit: SolvesService['submit'], userId: string | null = USER) {
    return buildTestApp({ sessions: testSessions(userId), solves: { submit } })
  }

  it('needs a session', async () => {
    const submit = vi.fn<SolvesService['submit']>()

    const res = await appWith(submit, null).request('/api/v1/solves', post(input))

    expect(res.status).toBe(401)
    expect(submit).not.toHaveBeenCalled()
  })

  it('checks the shape only: puzzle, number and string types and bounded replays', async () => {
    const submit = vi.fn<SolvesService['submit']>(async () => {})
    const app = appWith(submit)
    const tooManyMoves = Array.from({ length: 1001 }, (_, t) => ({ m: 'R', t }))

    for (const body of [
      { ...input, puzzle: '4x4x4' },
      { ...input, time: '9431' },
      { ...input, time: -1 },
      { ...input, scramble: '' },
      { ...input, replay: { ...input.replay, moves: tooManyMoves } }
    ]) {
      expect((await app.request('/api/v1/solves', post(body))).status).toBe(400)
    }
    expect(submit).not.toHaveBeenCalled()
  })

  it('accepts any non-negative time and answers 204', async () => {
    const submit = vi.fn<SolvesService['submit']>(async () => {})
    const app = appWith(submit)

    const fast = await app.request('/api/v1/solves', post({ ...input, time: 0 }))
    const plain = await app.request('/api/v1/solves', post({ time: 15000, scramble: "R U R'", puzzle: '2x2x2' }))

    expect(fast.status).toBe(204)
    expect(plain.status).toBe(204)
    expect(submit.mock.calls.map(([userId, body]) => [userId, body.time])).toEqual([
      [USER, 0],
      [USER, 15000]
    ])
  })

  it('answers 500 when the solve cannot be stored', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => {})

    const res = await appWith(() => Promise.reject(new Error('mongo down'))).request('/api/v1/solves', post(input))

    expect(res.status).toBe(500)
  })
})
