import type { Cube } from '@/entities/cube/model/types'

/**
 * In-memory stand-in for the IndexedDB wrapper. Clones on the way in and out so
 * it behaves like the real structured-clone storage and mutations cannot leak.
 */
const store = new Map<string, Cube>()
const clone = <T>(value: T): T => JSON.parse(JSON.stringify(value))

vi.mock('@/shared/config/indexdb/indexdb', () => ({
  database: {
    create: () => ({
      get: async (key: string) => (store.has(key) ? clone(store.get(key)!) : undefined),
      add: async (value: Cube) => void store.set(value.id, clone(value)),
      put: async (value: Cube) => void store.set(value.id, clone(value)),
      delete: async (key: string) => void store.delete(key),
      clear: async () => void store.clear(),
      find: () => ({ get: async () => clone([...store.values()]) })
    })
  }
}))

import { cubesDB } from '@/entities/cube/api/indexdb'
import { deleteSolve } from '@/features/manage-solves/api/deleteSolve'
import { SolveTab } from '@/shared/types/enums'
import { makeCube } from './fixtures/cube'
import { makeSolve } from './fixtures/solve'

const NOW = 1_700_000_000_000

const seed = (cube: Cube) => store.set(cube.id, clone(cube))
const raw = async (id: string) => (await cubesDB.getAllDatabase()).find((cube) => cube.id === id)!

describe('cubesDB.update', () => {
  beforeEach(() => {
    store.clear()
    vi.useFakeTimers()
    vi.setSystemTime(NOW)
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('keeps tombstones when persisting a cube read through getById', async () => {
    seed(
      makeCube({
        id: 'c1',
        allSolves: [makeSolve({ id: 'deleted', isDeleted: true, updatedAt: 500 }), makeSolve({ id: 'live' })]
      })
    )

    const cube = await cubesDB.getById('c1')
    expect(cube.solves.all).toHaveLength(1) // the read stripped the tombstone

    await cubesDB.update(cube)

    const persisted = await raw('c1')
    expect(persisted.solves.all.map((solve) => solve.id).sort()).toEqual(['deleted', 'live'])
    expect(persisted.solves.all.find((solve) => solve.id === 'deleted')!.isDeleted).toBe(true)
  })

  it('keeps tombstones when persisting a stale cube held in the timer store', async () => {
    // useSolveData writes back `selectedCube`, which came from getAll().
    seed(makeCube({ id: 'c1', sessionSolves: [makeSolve({ id: 'deleted', isDeleted: true, updatedAt: 500 })] }))

    const [fromStore] = await cubesDB.getAll()
    await cubesDB.update({
      ...fromStore,
      solves: { ...fromStore.solves, session: [makeSolve({ id: 'new' }), ...fromStore.solves.session] }
    })

    const persisted = await raw('c1')
    expect(persisted.solves.session.map((solve) => solve.id).sort()).toEqual(['deleted', 'new'])
  })

  it('refreshes updatedAt so cube-level conflict resolution can order the write', async () => {
    seed(makeCube({ id: 'c1', updatedAt: 1_000, allSolves: [] }))

    await cubesDB.update(await cubesDB.getById('c1'))

    expect((await raw('c1')).updatedAt).toBe(NOW)
  })

  it('creates the record untouched when the cube is new', async () => {
    await cubesDB.update(makeCube({ id: 'c1', allSolves: [makeSolve({ id: 's1' })] }))

    expect((await raw('c1')).solves.all).toHaveLength(1)
  })

  it('survives a delete followed by unrelated writes -- the regression this fixes', async () => {
    seed(
      makeCube({
        id: 'c1',
        sessionSolves: [makeSolve({ id: 'target' }), makeSolve({ id: 'other' })]
      })
    )

    await deleteSolve({ cubeId: 'c1', solveId: 'target', solveTab: SolveTab.SESSION })

    // Anything else the user does afterwards: a new solve, a toggle, a session end.
    for (let i = 0; i < 3; i++) {
      const cube = await cubesDB.getById('c1')
      await cubesDB.update({
        ...cube,
        solves: { ...cube.solves, session: [makeSolve({ id: `later-${i}` }), ...cube.solves.session] }
      })
    }

    // getAllDatabase is what the backup upload serialises: the deletion must still be in there.
    const uploaded = await raw('c1')
    const target = uploaded.solves.session.find((solve) => solve.id === 'target')
    expect(target).toBeDefined()
    expect(target!.isDeleted).toBe(true)
    expect(target!.updatedAt).toBe(NOW)
  })
})
