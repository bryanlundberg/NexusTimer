import type { Mock } from 'vitest'

vi.mock('@/entities/cube/api/indexdb', () => ({
  cubesDB: {
    add: vi.fn()
  }
}))

import { quickStartCollection, QUICK_START_CATEGORIES } from '@/features/manage-cubes/model/quickStartCollection'
import { cubesDB } from '@/entities/cube/api/indexdb'
import { useTimerStore } from '@/shared/model/timer/useTimerStore'
import { isValidCategory } from '@/shared/const/cube-categories'

const add = cubesDB.add as Mock

beforeEach(() => {
  vi.clearAllMocks()
  add.mockImplementation(async (cube) => cube)
  useTimerStore.setState({ cubes: [], selectedCube: null, event: null, lastSolve: null })
})

describe('quickStartCollection', () => {
  it('offers valid categories only', () => {
    expect(QUICK_START_CATEGORIES.every(isValidCategory)).toBe(true)
  })

  it('saves a collection named after its category', async () => {
    const cube = await quickStartCollection('3x3 OH')

    expect(add).toHaveBeenCalledWith(expect.objectContaining({ name: '3x3 OH', category: '3x3 OH', isDeleted: false }))
    expect(cube.solves).toEqual({ all: [], session: [] })
  })

  it('adds the collection to the store and selects it', async () => {
    const cube = await quickStartCollection('2x2')
    const state = useTimerStore.getState()

    expect(state.cubes?.map((item) => item.id)).toEqual([cube.id])
    expect(state.selectedCube?.id).toBe(cube.id)
    expect(state.event).toBe('222')
  })

  it('leaves the store untouched when saving fails', async () => {
    add.mockRejectedValueOnce(new Error('quota'))

    await expect(quickStartCollection('3x3')).rejects.toThrow('quota')
    expect(useTimerStore.getState().cubes).toEqual([])
    expect(useTimerStore.getState().selectedCube).toBeNull()
  })
})
