import { vi, beforeEach, afterEach } from 'vitest'
import { SolveTab } from '@/shared/types/enums'
import { makeCube } from './fixtures/cube'
import { makeSolve } from './fixtures/solve'

// cubesDB is IndexedDB-backed; mock it so the move logic can be tested in isolation.
const { getById, update } = vi.hoisted(() => ({ getById: vi.fn(), update: vi.fn() }))
vi.mock('@/entities/cube/api/indexdb', () => ({ cubesDB: { getById, update } }))

import moveSolveSession from '@/features/manage-solves/api/moveSolveSession'

beforeEach(() => {
  getById.mockReset()
  update.mockReset()
  update.mockImplementation(async (cube) => cube)
})

afterEach(() => {
  vi.restoreAllMocks()
})

describe('moveSolveSession', () => {
  it('soft-deletes the source solve and adds a live copy to the target bucket', async () => {
    const cube = makeCube({ id: 'A', sessionSolves: [makeSolve({ id: 's1', isDeleted: false })] })
    getById.mockResolvedValue(cube)

    const result = await moveSolveSession({ cubeId: 'A', solveId: 's1', fromTab: SolveTab.SESSION })

    expect(result.solves.session.find((s) => s.id === 's1')!.isDeleted).toBe(true)
    const moved = result.solves.all.find((s) => s.id === 's1')!
    expect(moved).toBeDefined()
    expect(moved.isDeleted).toBe(false)
  })

  it('stamps the live copy one tick after the soft-deleted source', async () => {
    vi.spyOn(Date, 'now').mockReturnValue(5000)
    const cube = makeCube({ id: 'A', sessionSolves: [makeSolve({ id: 's1', isDeleted: false })] })
    getById.mockResolvedValue(cube)

    const result = await moveSolveSession({ cubeId: 'A', solveId: 's1', fromTab: SolveTab.SESSION })

    expect(result.solves.session.find((s) => s.id === 's1')!.updatedAt).toBe(5000)
    expect(result.solves.all.find((s) => s.id === 's1')!.updatedAt).toBe(5001)
  })

  it('replaces an existing solve in the target bucket instead of duplicating it', async () => {
    const cube = makeCube({
      id: 'A',
      sessionSolves: [makeSolve({ id: 's1', isDeleted: false, time: 111 })],
      allSolves: [makeSolve({ id: 's1', isDeleted: true, time: 999 })]
    })
    getById.mockResolvedValue(cube)

    const result = await moveSolveSession({ cubeId: 'A', solveId: 's1', fromTab: SolveTab.SESSION })

    const allS1 = result.solves.all.filter((s) => s.id === 's1')
    expect(allS1).toHaveLength(1)
    expect(allS1[0].isDeleted).toBe(false)
    expect(allS1[0].time).toBe(111)
  })

  it('throws when the cube does not exist', async () => {
    getById.mockResolvedValue(undefined)
    await expect(moveSolveSession({ cubeId: 'nope', solveId: 's1', fromTab: SolveTab.SESSION })).rejects.toThrow(
      'Cube not found'
    )
  })

  it('throws when the solve is not in the specified tab', async () => {
    const cube = makeCube({ id: 'A', sessionSolves: [makeSolve({ id: 's1', isDeleted: false })] })
    getById.mockResolvedValue(cube)
    await expect(moveSolveSession({ cubeId: 'A', solveId: 'missing', fromTab: SolveTab.SESSION })).rejects.toThrow(
      'Solve not found in the specified tab'
    )
  })
})
