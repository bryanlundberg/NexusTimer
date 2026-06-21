import { vi, beforeEach } from 'vitest'
import { SolveTab } from '@/shared/types/enums'
import { makeCube } from './fixtures/cube'
import { makeSolve } from './fixtures/solve'

// cubesDB is IndexedDB-backed; mock it so the move logic can be tested in isolation.
const { getById, update } = vi.hoisted(() => ({ getById: vi.fn(), update: vi.fn() }))
vi.mock('@/entities/cube/api/indexdb', () => ({ cubesDB: { getById, update } }))

import { moveSolvesBatch } from '@/features/manage-solves/api/moveSolvesBatch'

beforeEach(() => {
  getById.mockReset()
  update.mockReset()
  update.mockImplementation(async (cube) => cube) // return whatever was persisted
})

describe('moveSolvesBatch', () => {
  it('moves a solve from session to all: source is soft-deleted, a live copy lands in all', async () => {
    const cube = makeCube({
      id: 'A',
      sessionSolves: [makeSolve({ id: 's1', isDeleted: false }), makeSolve({ id: 's2', isDeleted: false })]
    })
    getById.mockResolvedValue(cube)

    const result = await moveSolvesBatch({ cubeId: 'A', solveIds: ['s1'], fromTab: SolveTab.SESSION })

    const sessionS1 = result.solves.session.find((s) => s.id === 's1')!
    const allS1 = result.solves.all.find((s) => s.id === 's1')!
    expect(sessionS1.isDeleted).toBe(true)
    expect(allS1).toBeDefined()
    expect(allS1.isDeleted).toBe(false)
    // the live copy is stamped one tick after the soft-deleted source
    expect(allS1.updatedAt).toBe(sessionS1.updatedAt! + 1)
  })

  it('moves a solve from all to session when fromTab is ALL', async () => {
    const cube = makeCube({ id: 'A', allSolves: [makeSolve({ id: 'a1', isDeleted: false })] })
    getById.mockResolvedValue(cube)

    const result = await moveSolvesBatch({ cubeId: 'A', solveIds: ['a1'], fromTab: SolveTab.ALL })

    expect(result.solves.all.find((s) => s.id === 'a1')!.isDeleted).toBe(true)
    const moved = result.solves.session.find((s) => s.id === 'a1')!
    expect(moved).toBeDefined()
    expect(moved.isDeleted).toBe(false)
  })

  it('replaces an existing solve in the target bucket instead of duplicating it', async () => {
    const cube = makeCube({
      id: 'A',
      sessionSolves: [makeSolve({ id: 's1', isDeleted: false, time: 111 })],
      allSolves: [makeSolve({ id: 's1', isDeleted: true, time: 999 })]
    })
    getById.mockResolvedValue(cube)

    const result = await moveSolvesBatch({ cubeId: 'A', solveIds: ['s1'], fromTab: SolveTab.SESSION })

    const allS1 = result.solves.all.filter((s) => s.id === 's1')
    expect(allS1).toHaveLength(1)
    expect(allS1[0].isDeleted).toBe(false)
    expect(allS1[0].time).toBe(111) // replaced with the moved source solve
  })

  it('only moves the requested ids and leaves the rest untouched', async () => {
    const cube = makeCube({
      id: 'A',
      sessionSolves: [
        makeSolve({ id: 's1', isDeleted: false }),
        makeSolve({ id: 's2', isDeleted: false }),
        makeSolve({ id: 's3', isDeleted: false })
      ]
    })
    getById.mockResolvedValue(cube)

    const result = await moveSolvesBatch({ cubeId: 'A', solveIds: ['s1', 's3'], fromTab: SolveTab.SESSION })

    expect(result.solves.all.map((s) => s.id).sort()).toEqual(['s1', 's3'])
    expect(result.solves.session.find((s) => s.id === 's1')!.isDeleted).toBe(true)
    expect(result.solves.session.find((s) => s.id === 's3')!.isDeleted).toBe(true)
    expect(result.solves.session.find((s) => s.id === 's2')!.isDeleted).toBe(false)
  })

  it('persists the cube exactly once', async () => {
    const cube = makeCube({ id: 'A', sessionSolves: [makeSolve({ id: 's1', isDeleted: false })] })
    getById.mockResolvedValue(cube)

    await moveSolvesBatch({ cubeId: 'A', solveIds: ['s1'], fromTab: SolveTab.SESSION })

    expect(update).toHaveBeenCalledTimes(1)
    expect(update).toHaveBeenCalledWith(cube)
  })

  it('throws when the cube does not exist', async () => {
    getById.mockResolvedValue(undefined)
    await expect(moveSolvesBatch({ cubeId: 'nope', solveIds: ['s1'], fromTab: SolveTab.SESSION })).rejects.toThrow(
      'Cube not found'
    )
  })
})
