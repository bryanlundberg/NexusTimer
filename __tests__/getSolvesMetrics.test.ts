import getSolvesMetrics from '@/shared/lib/statistics/getSolvesMetrics'
import { makeSolve } from './fixtures/solve'
import { makeCube } from './fixtures/cube'

describe('getSolvesMetrics', () => {
  it('returns empty buckets when cubesDB is null', () => {
    expect(getSolvesMetrics({ cubesDB: null, category: '3x3', cubeName: 'My Cube' })).toEqual({
      global: [],
      session: [],
      cubeAll: [],
      cubeSession: []
    })
  })

  it('returns empty buckets when cubesDB is empty', () => {
    expect(getSolvesMetrics({ cubesDB: [], category: '3x3', cubeName: 'My Cube' })).toEqual({
      global: [],
      session: [],
      cubeAll: [],
      cubeSession: []
    })
  })

  it('ignores cubes of other categories', () => {
    const cubes = [
      makeCube({
        category: '2x2',
        sessionSolves: [makeSolve({ time: 1000, endTime: 1 })]
      })
    ]
    const result = getSolvesMetrics({ cubesDB: cubes, category: '3x3', cubeName: 'My Cube' })
    expect(result.global).toHaveLength(0)
    expect(result.session).toHaveLength(0)
  })

  it('populates global and session from every cube in the category', () => {
    const cubeA = makeCube({
      name: 'A',
      category: '3x3',
      sessionSolves: [makeSolve({ time: 1000, endTime: 10 })],
      allSolves: [makeSolve({ time: 2000, endTime: 5 })]
    })
    const cubeB = makeCube({
      name: 'B',
      category: '3x3',
      sessionSolves: [makeSolve({ time: 3000, endTime: 20 })]
    })
    const result = getSolvesMetrics({ cubesDB: [cubeA, cubeB], category: '3x3', cubeName: 'A' })
    expect(result.global.map((s) => s.time)).toEqual([3000, 1000, 2000])
    expect(result.session.map((s) => s.time)).toEqual([3000, 1000])
  })

  it('populates cubeAll and cubeSession only for the target cube', () => {
    const cubeA = makeCube({
      name: 'A',
      category: '3x3',
      sessionSolves: [makeSolve({ time: 1000, endTime: 10 })],
      allSolves: [makeSolve({ time: 2000, endTime: 5 })]
    })
    const cubeB = makeCube({
      name: 'B',
      category: '3x3',
      sessionSolves: [makeSolve({ time: 3000, endTime: 20 })]
    })
    const result = getSolvesMetrics({ cubesDB: [cubeA, cubeB], category: '3x3', cubeName: 'A' })
    expect(result.cubeAll.map((s) => s.time)).toEqual([1000, 2000])
    expect(result.cubeSession.map((s) => s.time)).toEqual([1000])
  })

  it('leaves cubeAll/cubeSession empty when cubeName does not match', () => {
    const cubeA = makeCube({
      name: 'A',
      category: '3x3',
      sessionSolves: [makeSolve({ time: 1000, endTime: 10 })]
    })
    const result = getSolvesMetrics({ cubesDB: [cubeA], category: '3x3', cubeName: 'Unknown' })
    expect(result.cubeAll).toHaveLength(0)
    expect(result.cubeSession).toHaveLength(0)
  })

  it('excludes deleted solves from every bucket', () => {
    const cube = makeCube({
      name: 'A',
      category: '3x3',
      sessionSolves: [makeSolve({ time: 1000, endTime: 10 }), makeSolve({ time: 9999, endTime: 11, isDeleted: true })],
      allSolves: [makeSolve({ time: 2000, endTime: 5 }), makeSolve({ time: 8888, endTime: 6, isDeleted: true })]
    })
    const result = getSolvesMetrics({ cubesDB: [cube], category: '3x3', cubeName: 'A' })
    expect(result.global.map((s) => s.time)).toEqual([1000, 2000])
    expect(result.session.map((s) => s.time)).toEqual([1000])
    expect(result.cubeAll.map((s) => s.time)).toEqual([1000, 2000])
    expect(result.cubeSession.map((s) => s.time)).toEqual([1000])
  })

  it('sorts each bucket by endTime descending', () => {
    const cube = makeCube({
      name: 'A',
      category: '3x3',
      sessionSolves: [
        makeSolve({ time: 100, endTime: 1 }),
        makeSolve({ time: 200, endTime: 3 }),
        makeSolve({ time: 300, endTime: 2 })
      ]
    })
    const result = getSolvesMetrics({ cubesDB: [cube], category: '3x3', cubeName: 'A' })
    expect(result.session.map((s) => s.endTime)).toEqual([3, 2, 1])
  })
})
