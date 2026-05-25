import { preventDuplicateDeleteStatus } from '@/features/manage-backup/lib/importDataFromFile'
import { makeSolve } from './fixtures/solve'
import { makeCube } from './fixtures/cube'

describe('preventDuplicateDeleteStatus', () => {
  it('returns an empty array when given no cubes', () => {
    expect(preventDuplicateDeleteStatus([])).toEqual([])
  })

  it('keeps a solve that exists only in the session bucket', () => {
    const cube = makeCube({ sessionSolves: [makeSolve({ id: 's1', updatedAt: 100 })], allSolves: [] })
    const [result] = preventDuplicateDeleteStatus([cube])
    expect(result.solves.session.map((s) => s.id)).toEqual(['s1'])
    expect(result.solves.all).toEqual([])
  })

  it('keeps a solve that exists only in the all bucket', () => {
    const cube = makeCube({ sessionSolves: [], allSolves: [makeSolve({ id: 's1', updatedAt: 100 })] })
    const [result] = preventDuplicateDeleteStatus([cube])
    expect(result.solves.session).toEqual([])
    expect(result.solves.all.map((s) => s.id)).toEqual(['s1'])
  })

  it('keeps the session version when updatedAt ties (session is processed first)', () => {
    const cube = makeCube({
      sessionSolves: [makeSolve({ id: 's1', time: 1000, updatedAt: 100, isDeleted: false })],
      allSolves: [makeSolve({ id: 's1', time: 9999, updatedAt: 100, isDeleted: true })]
    })
    const [result] = preventDuplicateDeleteStatus([cube])
    expect(result.solves.session).toHaveLength(1)
    expect(result.solves.session[0].time).toBe(1000)
    expect(result.solves.session[0].isDeleted).toBe(false)
    expect(result.solves.all).toEqual([])
  })

  it('replaces with the all version when its updatedAt is newer (moves to all bucket)', () => {
    const cube = makeCube({
      sessionSolves: [makeSolve({ id: 's1', time: 1000, updatedAt: 100 })],
      allSolves: [makeSolve({ id: 's1', time: 9999, updatedAt: 200 })]
    })
    const [result] = preventDuplicateDeleteStatus([cube])
    expect(result.solves.session).toEqual([])
    expect(result.solves.all).toHaveLength(1)
    expect(result.solves.all[0].time).toBe(9999)
  })

  it('keeps the session version when its updatedAt is newer', () => {
    const cube = makeCube({
      sessionSolves: [makeSolve({ id: 's1', time: 1000, updatedAt: 200 })],
      allSolves: [makeSolve({ id: 's1', time: 9999, updatedAt: 100 })]
    })
    const [result] = preventDuplicateDeleteStatus([cube])
    expect(result.solves.session).toHaveLength(1)
    expect(result.solves.session[0].time).toBe(1000)
    expect(result.solves.all).toEqual([])
  })

  it('treats missing updatedAt as 0 for comparison', () => {
    const sessSolve = makeSolve({ id: 's1', time: 1000 })
    delete (sessSolve as Record<string, unknown>).updatedAt
    const allSolve = makeSolve({ id: 's1', time: 9999, updatedAt: 5 })
    const cube = makeCube({ sessionSolves: [sessSolve], allSolves: [allSolve] })
    const [result] = preventDuplicateDeleteStatus([cube])
    // all has 5 > 0 → all wins
    expect(result.solves.all).toHaveLength(1)
    expect(result.solves.all[0].time).toBe(9999)
  })

  it('strips the internal _wasInSession marker from the output', () => {
    const cube = makeCube({ sessionSolves: [makeSolve({ id: 's1' })], allSolves: [] })
    const [result] = preventDuplicateDeleteStatus([cube])
    expect(result.solves.session[0]).not.toHaveProperty('_wasInSession')
  })

  it('processes each cube independently', () => {
    const cubeA = makeCube({ id: 'a', sessionSolves: [makeSolve({ id: 'shared', time: 1000, updatedAt: 100 })] })
    const cubeB = makeCube({ id: 'b', allSolves: [makeSolve({ id: 'shared', time: 9999, updatedAt: 100 })] })
    const result = preventDuplicateDeleteStatus([cubeA, cubeB])
    expect(result[0].solves.session.map((s) => s.id)).toEqual(['shared'])
    expect(result[1].solves.all.map((s) => s.id)).toEqual(['shared'])
  })
})
