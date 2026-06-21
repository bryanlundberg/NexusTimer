import type { Mock } from 'vitest'

vi.mock('@/entities/cube/api/indexdb', () => ({
  cubesDB: {
    getById: vi.fn(),
    update: vi.fn()
  }
}))

import { editCubeCollection } from '@/features/manage-cubes/api/editCubeCollection'
import { cubesDB } from '@/entities/cube/api/indexdb'
import { makeCube } from './fixtures/cube'

const getById = cubesDB.getById as Mock
const update = cubesDB.update as Mock

const OLD = 1_000
const NOW = 1_700_000_000_000

describe('editCubeCollection', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.useFakeTimers()
    vi.setSystemTime(NOW)
    update.mockImplementation(async (cube) => cube)
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('refreshes updatedAt to the current time', async () => {
    getById.mockResolvedValue(makeCube({ id: 'c1', updatedAt: OLD }))

    const result = await editCubeCollection({ id: 'c1', name: 'Renamed' })

    expect(result.updatedAt).toBe(NOW)
    expect(result.updatedAt).not.toBe(OLD)
  })

  it('applies the dto changes over the existing cube', async () => {
    getById.mockResolvedValue(makeCube({ id: 'c1', name: 'Old', favorite: false }))

    const result = await editCubeCollection({ id: 'c1', name: 'Renamed', favorite: true })

    expect(result.name).toBe('Renamed')
    expect(result.favorite).toBe(true)
  })

  it('keeps fields not present in the dto untouched', async () => {
    getById.mockResolvedValue(makeCube({ id: 'c1', name: 'Old', category: '3x3', createdAt: 42 }))

    const result = await editCubeCollection({ id: 'c1', name: 'Renamed' })

    expect(result.category).toBe('3x3')
    expect(result.createdAt).toBe(42)
  })

  it('persists the updated cube through cubesDB.update', async () => {
    getById.mockResolvedValue(makeCube({ id: 'c1' }))

    const result = await editCubeCollection({ id: 'c1', name: 'Renamed' })

    expect(update).toHaveBeenCalledTimes(1)
    expect(update).toHaveBeenCalledWith(result)
  })

  it('throws and does not persist when the cube is not found', async () => {
    getById.mockResolvedValue(undefined)

    await expect(editCubeCollection({ id: 'missing', name: 'X' })).rejects.toThrow('Cube not found')
    expect(update).not.toHaveBeenCalled()
  })
})
