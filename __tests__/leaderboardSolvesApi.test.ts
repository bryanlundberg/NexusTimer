import { submitLeaderboardSolve } from '@/features/timer/api/leaderboardSolvesApi'
import type { Solve } from '@/entities/solve/model/types'

const solve: Solve = {
  id: 's1',
  cubeId: 'c1',
  scramble: "R U R' U'",
  startTime: 1000,
  endTime: 10431,
  bookmark: false,
  time: 9431,
  rating: 0,
  dnf: false,
  plus2: false,
  replay: { version: 1, puzzle: '3x3x3', scramble: "R U R' U'", durationMs: 9431, moves: [{ m: 'R', t: 120 }] }
}

describe('submitLeaderboardSolve', () => {
  const fetchMock = vi.fn()

  beforeEach(() => {
    fetchMock.mockReset()
    vi.stubGlobal('fetch', fetchMock)
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  const sentBody = () => JSON.parse(fetchMock.mock.calls[0][1].body)

  it('posts the solve with its replay to the API', async () => {
    fetchMock.mockResolvedValue(new Response(null, { status: 204 }))

    expect(await submitLeaderboardSolve({ solve, puzzle: '3x3x3', smart: true, solution: "R U R'" })).toBe(true)
    expect(fetchMock.mock.calls[0][0]).toBe('/api/v1/solves')
    expect(sentBody()).toEqual({
      time: 9431,
      scramble: "R U R' U'",
      puzzle: '3x3x3',
      smart: true,
      solution: "R U R'",
      replay: solve.replay
    })
  })

  it('leaves out a replay the API would refuse', async () => {
    fetchMock.mockResolvedValue(new Response(null, { status: 204 }))
    const long = { ...solve.replay!, moves: Array.from({ length: 1001 }, (_, t) => ({ m: 'R', t })) }

    await submitLeaderboardSolve({ solve: { ...solve, replay: long }, puzzle: '2x2x2', smart: false })

    expect(sentBody()).toEqual({ time: 9431, scramble: "R U R' U'", puzzle: '2x2x2', smart: false })
  })

  it('treats a signed-out user as nothing to store and reports server failures', async () => {
    fetchMock.mockResolvedValueOnce(new Response(null, { status: 401 }))
    fetchMock.mockResolvedValueOnce(new Response(null, { status: 500 }))

    expect(await submitLeaderboardSolve({ solve, puzzle: '3x3x3', smart: false })).toBe(true)
    expect(await submitLeaderboardSolve({ solve, puzzle: '3x3x3', smart: false })).toBe(false)
  })
})
