import type { Cube } from '@/entities/cube/model/types'
import type { Solve } from '@/entities/solve/model/types'

const { store, clone, replaceAll } = vi.hoisted(() => {
  const store = new Map<string, Cube>()
  const clone = <T>(value: T): T => JSON.parse(JSON.stringify(value))
  const replaceAll = vi.fn(async (values: Cube[]) => {
    store.clear()
    for (const value of values) store.set(value.id, clone(value))
  })
  return { store, clone, replaceAll }
})

vi.mock('@/shared/config/indexdb/indexdb', () => ({
  database: {
    create: () => ({
      get: async (key: string) => (store.has(key) ? clone(store.get(key)!) : undefined),
      add: async (value: Cube) => void store.set(value.id, clone(value)),
      put: async (value: Cube) => void store.set(value.id, clone(value)),
      delete: async (key: string) => void store.delete(key),
      clear: async () => void store.clear(),
      replaceAll,
      find: () => ({ get: async () => clone([...store.values()]) })
    })
  }
}))

import { cubesDB } from '@/entities/cube/api/indexdb'
import { normalizeCubeSolves } from '@/entities/cube/lib/normalizeCubeSolves'
import {
  compareNewestFirst,
  isSortedNewestFirst,
  mergeSolvesNewestFirst,
  sortSolvesNewestFirst
} from '@/entities/solve/lib/sortSolves'
import { deleteSolve } from '@/features/manage-solves/api/deleteSolve'
import { toggleDNF } from '@/features/manage-solves/api/toggleDNF'
import moveSolveSession from '@/features/manage-solves/api/moveSolveSession'
import { moveSolvesBatch } from '@/features/manage-solves/api/moveSolvesBatch'
import { SolveTab } from '@/shared/types/enums'
import { makeCube } from './fixtures/cube'
import { makeSolve } from './fixtures/solve'

function rng(seed: number) {
  let state = seed
  return () => {
    state = (state * 1664525 + 1013904223) % 4294967296
    return state / 4294967296
  }
}

const at = (endTime: number, overrides: Partial<Solve> = {}) =>
  makeSolve({ id: `s-${endTime}`, endTime, startTime: endTime - 1000, ...overrides })

const ends = (solves: Solve[]) => solves.map((solve) => solve.endTime)

const shuffle = <T>(items: T[], random: () => number) => {
  const out = [...items]
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1))
    ;[out[i], out[j]] = [out[j], out[i]]
  }
  return out
}

const expectStoredSorted = () => {
  for (const cube of store.values()) {
    expect(isSortedNewestFirst(cube.solves.session)).toBe(true)
    expect(isSortedNewestFirst(cube.solves.all)).toBe(true)
  }
}

beforeEach(() => {
  store.clear()
  replaceAll.mockClear()
})

describe('sortSolvesNewestFirst', () => {
  it('returns the same array when it is already ordered', () => {
    const solves = [at(3), at(2), at(1)]
    expect(sortSolvesNewestFirst(solves)).toBe(solves)
  })

  it('sorts a copy when out of order, leaving the input untouched', () => {
    const solves = [at(1), at(3), at(2)]
    const sorted = sortSolvesNewestFirst(solves)
    expect(ends(sorted)).toEqual([3, 2, 1])
    expect(ends(solves)).toEqual([1, 3, 2])
  })

  it('breaks endTime ties by the later startTime', () => {
    const early = makeSolve({ id: 'early', endTime: 10, startTime: 1 })
    const late = makeSolve({ id: 'late', endTime: 10, startTime: 5 })
    expect(sortSolvesNewestFirst([early, late]).map((solve) => solve.id)).toEqual(['late', 'early'])
  })
})

describe('mergeSolvesNewestFirst', () => {
  it('matches a full sort for random lists, ordered or not', () => {
    const random = rng(7)
    for (let round = 0; round < 50; round++) {
      const lists = Array.from({ length: 1 + Math.floor(random() * 6) }, () =>
        Array.from({ length: Math.floor(random() * 30) }, () =>
          makeSolve({ endTime: Math.floor(random() * 500), startTime: Math.floor(random() * 500) })
        )
      )
      const expected = lists.flat().sort(compareNewestFirst)
      expect(ends(mergeSolvesNewestFirst(lists))).toEqual(ends(expected))
    }
  })

  it('returns an empty list when every input is empty', () => {
    expect(mergeSolvesNewestFirst([[], []])).toEqual([])
  })
})

describe('normalizeCubeSolves', () => {
  it('returns the same cube when both buckets are ordered', () => {
    const cube = makeCube({ sessionSolves: [at(2), at(1)], allSolves: [at(4), at(3)] })
    expect(normalizeCubeSolves(cube)).toBe(cube)
  })

  it('orders both buckets newest first', () => {
    const cube = normalizeCubeSolves(makeCube({ sessionSolves: [at(1), at(2)], allSolves: [at(3), at(4)] }))
    expect(ends(cube.solves.session)).toEqual([2, 1])
    expect(ends(cube.solves.all)).toEqual([4, 3])
  })
})

describe('cubesDB keeps stored solves ordered', () => {
  it('orders on add', async () => {
    await cubesDB.add(makeCube({ id: 'c1', sessionSolves: [at(1), at(3), at(2)] }))
    expect(ends(store.get('c1')!.solves.session)).toEqual([3, 2, 1])
  })

  it('orders on update, including tombstones preserved from the stored record', async () => {
    store.set('c1', makeCube({ id: 'c1', allSolves: [at(5, { isDeleted: true }), at(1)] }))
    const cube = await cubesDB.getById('c1')
    await cubesDB.update({ ...cube, solves: { ...cube.solves, all: [at(9), ...cube.solves.all] } })
    expect(ends(store.get('c1')!.solves.all)).toEqual([9, 5, 1])
  })

  it('replaces everything in one call with every cube ordered', async () => {
    store.set('old', makeCube({ id: 'old' }))
    await cubesDB.replaceAll([makeCube({ id: 'c1', sessionSolves: [at(1), at(2)], allSolves: [at(3), at(4)] })])
    expect(replaceAll).toHaveBeenCalledTimes(1)
    expect([...store.keys()]).toEqual(['c1'])
    expect(ends(store.get('c1')!.solves.session)).toEqual([2, 1])
    expect(ends(store.get('c1')!.solves.all)).toEqual([4, 3])
  })

  it('serves ordered reads even from a record written out of order', async () => {
    store.set('c1', makeCube({ id: 'c1', sessionSolves: [at(1), at(2)], allSolves: [at(3), at(4)] }))
    const [fromGetAll] = await cubesDB.getAll()
    const fromGetById = await cubesDB.getById('c1')
    const [fromDatabase] = await cubesDB.getAllDatabase()
    for (const cube of [fromGetAll, fromGetById, fromDatabase]) {
      expect(ends(cube.solves.session)).toEqual([2, 1])
      expect(ends(cube.solves.all)).toEqual([4, 3])
    }
  })

  it('holds under a random sequence of every write path', async () => {
    const random = rng(42)
    let clock = 1_000
    store.set('a', makeCube({ id: 'a', category: '3x3' }))
    store.set('b', makeCube({ id: 'b', category: '3x3' }))
    const ids = ['a', 'b']
    const pick = <T>(items: T[]) => items[Math.floor(random() * items.length)]

    for (let step = 0; step < 300; step++) {
      const cubeId = pick(ids)
      const cube = await cubesDB.getById(cubeId)
      const live = [
        ...cube.solves.session.map((solve) => ({ solve, tab: SolveTab.SESSION })),
        ...cube.solves.all.map((solve) => ({ solve, tab: SolveTab.ALL }))
      ]
      const action = Math.floor(random() * 7)

      if (action <= 1 || live.length === 0) {
        clock += 1 + Math.floor(random() * 50)
        const solve = makeSolve({ id: `n-${step}`, cubeId, endTime: clock, startTime: clock - 500 })
        await cubesDB.update({ ...cube, solves: { ...cube.solves, session: [solve, ...cube.solves.session] } })
      } else if (action === 2) {
        const { solve, tab } = pick(live)
        await moveSolveSession({ cubeId, solveId: solve.id, fromTab: tab })
      } else if (action === 3) {
        const { tab } = pick(live)
        const from = live.filter((entry) => entry.tab === tab).map((entry) => entry.solve.id)
        await moveSolvesBatch({ cubeId, solveIds: from.filter(() => random() < 0.5), fromTab: tab })
      } else if (action === 4) {
        const { solve, tab } = pick(live)
        await toggleDNF({ cubeId, solveId: solve.id, dnf: !solve.dnf, solveTab: tab })
      } else if (action === 5) {
        const { solve, tab } = pick(live)
        await deleteSolve({ cubeId, solveId: solve.id, solveTab: tab })
      } else if (random() < 0.5) {
        await cubesDB.endSessionForCube(cube)
      } else {
        const raw = await cubesDB.getAllDatabase()
        await cubesDB.replaceAll(
          raw.map((stored) => ({
            ...stored,
            solves: {
              session: shuffle(stored.solves.session, random),
              all: shuffle(stored.solves.all, random)
            }
          }))
        )
      }

      expectStoredSorted()
    }
  })
})
