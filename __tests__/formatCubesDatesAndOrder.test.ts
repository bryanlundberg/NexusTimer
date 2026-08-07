import { formatCubesDatesAndOrder } from '@/features/manage-backup/lib/importDataFromFile'
import { makeSolve } from './fixtures/solve'
import { makeCube } from './fixtures/cube'

describe('formatCubesDatesAndOrder', () => {
  it('returns an empty array when given no cubes', () => {
    expect(formatCubesDatesAndOrder([])).toEqual([])
  })

  it('sorts session solves ascending by endTime', () => {
    const cube = makeCube({
      sessionSolves: [
        makeSolve({ id: 'b', startTime: 200, endTime: 220 }),
        makeSolve({ id: 'a', startTime: 100, endTime: 110 }),
        makeSolve({ id: 'c', startTime: 300, endTime: 330 })
      ]
    })
    const result = formatCubesDatesAndOrder([cube])
    expect(result[0].solves.session.map((s) => s.id)).toEqual(['a', 'b', 'c'])
  })

  it('sorts all solves ascending by endTime', () => {
    const cube = makeCube({
      allSolves: [
        makeSolve({ id: 'z', startTime: 999, endTime: 1200 }),
        makeSolve({ id: 'a', startTime: 1, endTime: 50 })
      ]
    })
    const result = formatCubesDatesAndOrder([cube])
    expect(result[0].solves.all.map((s) => s.id)).toEqual(['a', 'z'])
  })

  it('orders by when the timer stopped, not by when it started', () => {
    // A long solve can begin before a short one and still finish after it. Ordering
    // by startTime used to disagree with /solves and the Ao windows, which read endTime.
    const cube = makeCube({
      allSolves: [
        makeSolve({ id: 'long', startTime: 100, endTime: 900, time: 800 }),
        makeSolve({ id: 'short', startTime: 200, endTime: 260, time: 60 })
      ]
    })
    const result = formatCubesDatesAndOrder([cube])
    expect(result[0].solves.all.map((s) => s.id)).toEqual(['short', 'long'])
  })

  it('falls back to startTime when two solves share an endTime', () => {
    // Imported timestamps are second-granular, so collisions are common; the order
    // has to stay deterministic across reloads.
    const cube = makeCube({
      allSolves: [
        makeSolve({ id: 'second', startTime: 500, endTime: 1000 }),
        makeSolve({ id: 'first', startTime: 300, endTime: 1000 })
      ]
    })
    const result = formatCubesDatesAndOrder([cube])
    expect(result[0].solves.all.map((s) => s.id)).toEqual(['first', 'second'])
  })

  it('preserves the input cube order', () => {
    const cubes = [makeCube({ id: 'a' }), makeCube({ id: 'b' }), makeCube({ id: 'c' })]
    const result = formatCubesDatesAndOrder(cubes)
    expect(result.map((c) => c.id)).toEqual(['a', 'b', 'c'])
  })

  it('does not mutate the input cube array', () => {
    const original = makeSolve({ id: 'b', startTime: 200 })
    const cube = makeCube({
      sessionSolves: [original, makeSolve({ id: 'a', startTime: 100 })]
    })
    formatCubesDatesAndOrder([cube])
    expect(cube.solves.session[0].id).toBe('b')
  })

  it('handles empty session and all buckets', () => {
    const cube = makeCube({ sessionSolves: [], allSolves: [] })
    const result = formatCubesDatesAndOrder([cube])
    expect(result[0].solves.session).toEqual([])
    expect(result[0].solves.all).toEqual([])
  })
})
