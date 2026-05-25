import { aggregateByCube } from '@/shared/lib/aggregateByCube'
import { CubeCategory } from '@/shared/const/cube-categories'
import { makeSolve } from './fixtures/solve'
import { makeCube } from './fixtures/cube'

describe('aggregateByCube', () => {
  it('returns an empty array when given no cubes', () => {
    expect(aggregateByCube([], '3x3')).toEqual([])
  })

  it('filters out cubes that do not match the category', () => {
    const cubes = [
      makeCube({ id: 'a', name: 'A', category: '3x3', allSolves: [makeSolve({ time: 1000 })] }),
      makeCube({ id: 'b', name: 'B', category: '2x2', allSolves: [makeSolve({ time: 500 })] })
    ]
    const result = aggregateByCube(cubes, '3x3')
    expect(result).toHaveLength(1)
    expect(result[0].id).toBe('a')
  })

  it('aggregates all + session solves and excludes DNFs', () => {
    const cube = makeCube({
      id: 'a',
      name: 'A',
      category: '3x3',
      allSolves: [makeSolve({ time: 1000 }), makeSolve({ time: 2000 }), makeSolve({ time: 99999, dnf: true })],
      sessionSolves: [makeSolve({ time: 3000 }), makeSolve({ time: 99999, dnf: true })]
    })
    const result = aggregateByCube([cube], '3x3')
    expect(result[0].solvesCount).toBe(3)
    expect(result[0].totalTimeMs).toBe(6000)
  })

  it('returns 0 counts when there are no successful solves', () => {
    const cube = makeCube({
      id: 'a',
      name: 'A',
      category: '3x3',
      allSolves: [makeSolve({ time: 99999, dnf: true })]
    })
    const result = aggregateByCube([cube], '3x3')
    expect(result[0]).toEqual({ id: 'a', name: 'A', solvesCount: 0, totalTimeMs: 0 })
  })

  it('falls back to "Cube" when the cube has no name', () => {
    const cube = makeCube({ id: 'a', name: '', category: '3x3', allSolves: [makeSolve({ time: 1000 })] })
    const result = aggregateByCube([cube], '3x3')
    expect(result[0].name).toBe('Cube')
  })

  it('returns one entry per cube preserving input order', () => {
    const cubes = [
      makeCube({ id: 'a', name: 'A', category: '3x3', allSolves: [makeSolve({ time: 1000 })] }),
      makeCube({ id: 'b', name: 'B', category: '3x3', allSolves: [makeSolve({ time: 2000 })] }),
      makeCube({ id: 'c', name: 'C', category: '3x3', allSolves: [makeSolve({ time: 3000 })] })
    ]
    const result = aggregateByCube(cubes, '3x3')
    expect(result.map((c) => c.id)).toEqual(['a', 'b', 'c'])
  })

  it('does not filter when category is falsy', () => {
    const cubes = [
      makeCube({ id: 'a', category: '3x3', allSolves: [makeSolve({ time: 1000 })] }),
      makeCube({ id: 'b', category: '2x2', allSolves: [makeSolve({ time: 500 })] })
    ]
    const result = aggregateByCube(cubes, '' as unknown as CubeCategory)
    expect(result.map((c) => c.id)).toEqual(['a', 'b'])
  })
})
