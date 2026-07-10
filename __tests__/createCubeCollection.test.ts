import type { Mock } from 'vitest'

vi.mock('@/entities/cube/api/indexdb', () => ({
  cubesDB: {
    getAll: vi.fn(),
    add: vi.fn()
  }
}))

import { createCubeCollection } from '@/features/manage-cubes/api/createCubeCollection'
import { cubesDB } from '@/entities/cube/api/indexdb'
import { makeCube } from './fixtures/cube'
import { CreateCubeDTO } from '@/entities/cube/model/types'

const getAll = cubesDB.getAll as Mock
const add = cubesDB.add as Mock

const NOW = 1_700_000_000_000

const dto: CreateCubeDTO = { name: 'New Cube', category: '3x3' }

describe('createCubeCollection', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.useFakeTimers()
    vi.setSystemTime(NOW)
    getAll.mockResolvedValue([])
    add.mockImplementation(async (cube) => cube)
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('stamps updatedAt with the current time', async () => {
    const cube = await createCubeCollection(dto)
    expect(cube.updatedAt).toBe(NOW)
  })

  it('sets createdAt and updatedAt to the same value on creation', async () => {
    const cube = await createCubeCollection(dto)
    expect(cube.createdAt).toBe(NOW)
    expect(cube.updatedAt).toBe(NOW)
  })

  it('persists the new cube through cubesDB.add', async () => {
    const cube = await createCubeCollection(dto)
    expect(add).toHaveBeenCalledTimes(1)
    expect(add).toHaveBeenCalledWith(cube)
  })

  it('initializes a cube with sensible defaults', async () => {
    const cube = await createCubeCollection(dto)
    expect(cube).toEqual(
      expect.objectContaining({
        name: 'New Cube',
        category: '3x3',
        favorite: false,
        isDeleted: false,
        solves: { all: [], session: [] }
      })
    )
    expect(typeof cube.id).toBe('string')
    expect(cube.id.length).toBeGreaterThan(0)
  })

  it('allows creating a cube with an existing name (uniqueness is based on ID)', async () => {
    getAll.mockResolvedValue([makeCube({ name: 'new cube' })])

    const cube = await createCubeCollection(dto)
    expect(cube.name).toBe('New Cube')
    expect(add).toHaveBeenCalledTimes(1)
  })
})
