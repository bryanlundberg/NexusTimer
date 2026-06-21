import type { Mock } from 'vitest'

vi.mock('@/entities/cube/api/indexdb', () => ({
  cubesDB: {
    getById: vi.fn(),
    update: vi.fn()
  }
}))

import { deleteCubeCollection } from '@/features/manage-cubes/api/deleteCubeCollection'
import { cubesDB } from '@/entities/cube/api/indexdb'
import { makeCube } from './fixtures/cube'

const getById = cubesDB.getById as Mock
const update = cubesDB.update as Mock

const OLD = 1_000
const NOW = 1_700_000_000_000

describe('deleteCubeCollection', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.useFakeTimers()
    vi.setSystemTime(NOW)
    update.mockImplementation(async (cube) => cube)
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('refreshes updatedAt to the current time on (soft) delete', async () => {
    getById.mockResolvedValue(makeCube({ id: 'c1', updatedAt: OLD }))

    await deleteCubeCollection({ id: 'c1' })

    expect(update).toHaveBeenCalledTimes(1)
    const persisted = update.mock.calls[0][0]
    expect(persisted.updatedAt).toBe(NOW)
    expect(persisted.updatedAt).not.toBe(OLD)
  })

  it('marks the cube as deleted (soft delete) without removing other data', async () => {
    getById.mockResolvedValue(makeCube({ id: 'c1', name: 'Keep', isDeleted: false }))

    await deleteCubeCollection({ id: 'c1' })

    const persisted = update.mock.calls[0][0]
    expect(persisted.isDeleted).toBe(true)
    expect(persisted.id).toBe('c1')
    expect(persisted.name).toBe('Keep')
  })

  it('throws and does not persist when the cube is not found', async () => {
    getById.mockResolvedValue(undefined)

    await expect(deleteCubeCollection({ id: 'missing' })).rejects.toThrow('Cube not found')
    expect(update).not.toHaveBeenCalled()
  })
})
