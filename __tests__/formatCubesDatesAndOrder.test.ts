import { formatCubesDatesAndOrder } from '@/features/manage-backup/lib/importDataFromFile'
import { makeSolve } from './fixtures/solve'
import { makeCube } from './fixtures/cube'

describe('formatCubesDatesAndOrder', () => {
  it('returns an empty array when given no cubes', () => {
    expect(formatCubesDatesAndOrder([])).toEqual([])
  })

  it('sorts session solves ascending by startTime', () => {
    const cube = makeCube({
      sessionSolves: [
        makeSolve({ id: 'b', startTime: 200 }),
        makeSolve({ id: 'a', startTime: 100 }),
        makeSolve({ id: 'c', startTime: 300 })
      ]
    })
    const result = formatCubesDatesAndOrder([cube])
    expect(result[0].solves.session.map((s) => s.id)).toEqual(['a', 'b', 'c'])
  })

  it('sorts all solves ascending by startTime', () => {
    const cube = makeCube({
      allSolves: [makeSolve({ id: 'z', startTime: 999 }), makeSolve({ id: 'a', startTime: 1 })]
    })
    const result = formatCubesDatesAndOrder([cube])
    expect(result[0].solves.all.map((s) => s.id)).toEqual(['a', 'z'])
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
