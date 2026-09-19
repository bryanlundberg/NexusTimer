import type { Cube } from '@/entities/cube/model/types'
import { sortStoredSolves } from '@/shared/config/indexdb/indexdb'
import { makeCube } from './fixtures/cube'
import { makeSolve } from './fixtures/solve'

function fakeTransaction(records: Cube[]) {
  const updates: Cube[] = []
  const cursorAt = (index: number): any =>
    index >= records.length
      ? null
      : {
          value: records[index],
          update: async (value: Cube) => {
            records[index] = value
            updates.push(value)
          },
          continue: async () => cursorAt(index + 1)
        }
  return {
    updates,
    transaction: { objectStore: () => ({ openCursor: async () => cursorAt(0) }) } as any
  }
}

const at = (endTime: number) => makeSolve({ id: `s-${endTime}`, endTime, startTime: endTime - 1 })

describe('sortStoredSolves migration', () => {
  it('rewrites only the cubes that are out of order', async () => {
    const sorted = makeCube({ id: 'sorted', sessionSolves: [at(2), at(1)] })
    const mixed = makeCube({ id: 'mixed', sessionSolves: [at(1), at(3), at(2)], allSolves: [at(4), at(5)] })
    const records = [sorted, mixed]
    const { transaction, updates } = fakeTransaction(records)

    await sortStoredSolves(transaction)

    expect(updates.map((cube) => cube.id)).toEqual(['mixed'])
    expect(records[1].solves.session.map((solve) => solve.endTime)).toEqual([3, 2, 1])
    expect(records[1].solves.all.map((solve) => solve.endTime)).toEqual([5, 4])
  })

  it('skips a record it cannot read instead of aborting the upgrade', async () => {
    const broken = { id: 'broken', solves: { session: 42, all: [] } } as unknown as Cube
    const mixed = makeCube({ id: 'mixed', sessionSolves: [at(1), at(2)] })
    const { transaction, updates } = fakeTransaction([broken, mixed])

    await sortStoredSolves(transaction)

    expect(updates.map((cube) => cube.id)).toEqual(['mixed'])
  })
})
