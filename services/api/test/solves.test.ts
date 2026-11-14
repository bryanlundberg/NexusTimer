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
  replay: {
    version: 1,
    puzzle: '3x3x3',
    scramble: "R U R' U' F2 D",
    durationMs: 9431,
    moves: ["D'", 'F2', 'U', 'R', "U'", "R'"].map((m, i) => ({ m, t: i * 1880 }))
  }
}

const allowAll = { consume: async () => true }

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

    const result = await createSolvesService({ repository: { insert }, limits: allowAll }).submit(USER, input)

    expect(result).toBe('stored')
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

  it('stores null for a missing solution and treats a missing smart flag as false', async () => {
    const insert = vi.fn<(solve: NewSolve) => Promise<void>>(async () => {})
    const { solution: _solution, smart: _smart, ...rest } = input

    await createSolvesService({ repository: { insert }, limits: allowAll }).submit(USER, rest)

    expect(insert).toHaveBeenCalledWith(expect.objectContaining({ solution: null, smart: false }))
  })

  it('rejects a replay that does not solve the scramble without storing it', async () => {
    const insert = vi.fn<(solve: NewSolve) => Promise<void>>(async () => {})
    const replay = { ...input.replay, moves: input.replay.moves.slice(0, -1) }

    const result = await createSolvesService({ repository: { insert }, limits: allowAll }).submit(USER, {
      ...input,
      replay
    })

    expect(result).toBe('rejected')
    expect(insert).not.toHaveBeenCalled()
  })

  it('stops a user over the rate limit before verifying', async () => {
    const insert = vi.fn<(solve: NewSolve) => Promise<void>>(async () => {})

    const result = await createSolvesService({
      repository: { insert },
      limits: { consume: async () => false }
    }).submit(USER, input)

    expect(result).toBe('rate-limited')
    expect(insert).not.toHaveBeenCalled()
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

  it('rejects malformed bodies and solves without a replay', async () => {
    const submit = vi.fn<SolvesService['submit']>(async () => 'stored')
    const app = appWith(submit)
    const tooManyMoves = Array.from({ length: 1001 }, (_, t) => ({ m: 'R', t }))
    const { replay: _replay, ...noReplay } = input

    for (const body of [
      { ...input, puzzle: '4x4x4' },
      { ...input, time: '9431' },
      { ...input, time: -1 },
      { ...input, scramble: '' },
      { ...input, replay: { ...input.replay, moves: tooManyMoves } },
      noReplay
    ]) {
      expect((await app.request('/api/v1/solves', post(body))).status).toBe(400)
    }
    expect(submit).not.toHaveBeenCalled()
  })

  it('maps the submit result to 204, 400 and 429', async () => {
    const answer = async (result: Awaited<ReturnType<SolvesService['submit']>>) =>
      (await appWith(async () => result).request('/api/v1/solves', post(input))).status

    expect(await answer('stored')).toBe(204)
    expect(await answer('rejected')).toBe(400)
    expect(await answer('rate-limited')).toBe(429)
  })

  it('answers 500 when the solve cannot be stored', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => {})

    const res = await appWith(() => Promise.reject(new Error('mongo down'))).request('/api/v1/solves', post(input))

    expect(res.status).toBe(500)
  })
})
