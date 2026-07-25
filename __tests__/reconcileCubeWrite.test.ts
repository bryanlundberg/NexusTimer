import { reconcileCubeWrite } from '@/entities/cube/lib/reconcileCubeWrite'
import { makeCube } from './fixtures/cube'
import { makeSolve } from './fixtures/solve'

const ids = (solves: { id: string }[]) => solves.map((solve) => solve.id).sort()

describe('reconcileCubeWrite', () => {
  it('preserves tombstones the caller never saw', () => {
    // getById/getAll strip deleted solves, so the write only carries the live one.
    const tombstone = makeSolve({ id: 's1', isDeleted: true, updatedAt: 500 })
    const stored = makeCube({ id: 'c1', allSolves: [tombstone, makeSolve({ id: 's2' })] })
    const incoming = makeCube({ id: 'c1', allSolves: [makeSolve({ id: 's2' })] })

    const result = reconcileCubeWrite(stored, incoming)

    expect(ids(result.solves.all)).toEqual(['s1', 's2'])
    expect(result.solves.all.find((solve) => solve.id === 's1')).toEqual(tombstone)
  })

  it('keeps the incoming version of a solve that exists in both', () => {
    const stored = makeCube({ id: 'c1', allSolves: [makeSolve({ id: 's1', dnf: false, updatedAt: 100 })] })
    const incoming = makeCube({ id: 'c1', allSolves: [makeSolve({ id: 's1', dnf: true, updatedAt: 200 })] })

    const result = reconcileCubeWrite(stored, incoming)

    expect(result.solves.all).toHaveLength(1)
    expect(result.solves.all[0].dnf).toBe(true)
    expect(result.solves.all[0].updatedAt).toBe(200)
  })

  it('records a fresh deletion instead of reviving the stored live copy', () => {
    const stored = makeCube({ id: 'c1', allSolves: [makeSolve({ id: 's1', isDeleted: false, updatedAt: 100 })] })
    const incoming = makeCube({
      id: 'c1',
      allSolves: [makeSolve({ id: 's1', isDeleted: true, updatedAt: 900 })]
    })

    const result = reconcileCubeWrite(stored, incoming)

    expect(result.solves.all).toHaveLength(1)
    expect(result.solves.all[0].isDeleted).toBe(true)
  })

  it('does not duplicate a solve moved between buckets', () => {
    // moveSolveSession / endSessionForCube relocate a solve keeping its id.
    const stored = makeCube({ id: 'c1', sessionSolves: [makeSolve({ id: 's1' })] })
    const incoming = makeCube({ id: 'c1', sessionSolves: [], allSolves: [makeSolve({ id: 's1' })] })

    const result = reconcileCubeWrite(stored, incoming)

    expect(result.solves.session).toHaveLength(0)
    expect(ids(result.solves.all)).toEqual(['s1'])
  })

  it('preserves each bucket independently', () => {
    const stored = makeCube({
      id: 'c1',
      sessionSolves: [makeSolve({ id: 'a', isDeleted: true })],
      allSolves: [makeSolve({ id: 'b', isDeleted: true })]
    })
    const incoming = makeCube({ id: 'c1', sessionSolves: [], allSolves: [] })

    const result = reconcileCubeWrite(stored, incoming)

    expect(ids(result.solves.session)).toEqual(['a'])
    expect(ids(result.solves.all)).toEqual(['b'])
  })

  it('does not preserve the same id twice when it is stored in both buckets', () => {
    const stored = makeCube({
      id: 'c1',
      sessionSolves: [makeSolve({ id: 'dup', isDeleted: true })],
      allSolves: [makeSolve({ id: 'dup', isDeleted: true })]
    })
    const incoming = makeCube({ id: 'c1', sessionSolves: [], allSolves: [] })

    const result = reconcileCubeWrite(stored, incoming)

    expect([...result.solves.session, ...result.solves.all]).toHaveLength(1)
  })

  it('keeps the incoming metadata untouched', () => {
    const stored = makeCube({ id: 'c1', name: 'Old', favorite: false, allSolves: [] })
    const incoming = makeCube({ id: 'c1', name: 'New', favorite: true, allSolves: [] })

    const result = reconcileCubeWrite(stored, incoming)

    expect(result.name).toBe('New')
    expect(result.favorite).toBe(true)
  })

  it('returns the incoming cube as-is when nothing is stored yet', () => {
    const incoming = makeCube({ id: 'c1', allSolves: [makeSolve({ id: 's1' })] })

    expect(reconcileCubeWrite(undefined, incoming)).toBe(incoming)
    expect(reconcileCubeWrite(null, incoming)).toBe(incoming)
  })

  it('tolerates a stored record without solves', () => {
    const incoming = makeCube({ id: 'c1', allSolves: [makeSolve({ id: 's1' })] })

    expect(reconcileCubeWrite({ id: 'c1' } as never, incoming)).toBe(incoming)
  })
})
