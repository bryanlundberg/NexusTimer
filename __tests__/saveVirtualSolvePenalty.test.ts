import type { Cube } from '@/entities/cube/model/types'

vi.mock('@/entities/cube/api/indexdb', () => ({
  cubesDB: { update: vi.fn(async (cube: Cube) => cube) }
}))
vi.mock('@/features/timer/api/leaderboardSolvesApi', () => ({
  submitLeaderboardSolve: vi.fn(async () => true)
}))

import { cubesDB } from '@/entities/cube/api/indexdb'
import { submitLeaderboardSolve } from '@/features/timer/api/leaderboardSolvesApi'
import { saveVirtualSolve } from '@/features/timer/lib/saveVirtualSolve'
import { useTimerStore } from '@/shared/model/timer/useTimerStore'
import { makeCube } from './fixtures/cube'

const savedSolve = () => vi.mocked(cubesDB.update).mock.calls.at(-1)![0].solves.session[0]

describe('saveVirtualSolve penalties', () => {
  beforeEach(() => {
    vi.mocked(cubesDB.update).mockClear()
    vi.mocked(submitLeaderboardSolve).mockClear()
    useTimerStore.setState({ selectedCube: makeCube({ id: 'cube', category: '3x3' }) })
  })

  it('adds the +2 to the saved and submitted time', async () => {
    await saveVirtualSolve({ timeMs: 9000, scramble: 'R U', dnf: false, plus2: true })

    expect(savedSolve()).toMatchObject({ time: 11_000, plus2: true, dnf: false })
    expect(vi.mocked(submitLeaderboardSolve).mock.calls[0][0].solve.time).toBe(11_000)
  })

  it('saves a DNF without sending it to the leaderboard', async () => {
    await saveVirtualSolve({ timeMs: 9000, scramble: 'R U', dnf: true })

    expect(savedSolve()).toMatchObject({ time: 9000, plus2: false, dnf: true })
    expect(submitLeaderboardSolve).not.toHaveBeenCalled()
  })

  it('still sends a clean solve to the leaderboard', async () => {
    await saveVirtualSolve({ timeMs: 9000, scramble: 'R U', dnf: false })

    expect(savedSolve()).toMatchObject({ time: 9000, plus2: false, dnf: false })
    expect(submitLeaderboardSolve).toHaveBeenCalledOnce()
  })
})
