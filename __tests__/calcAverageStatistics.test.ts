import calcAverageStatistics from '@/shared/lib/statistics/calcAverageStatistics'
import { makeSolve } from './fixtures/solve'
import { makeCube } from './fixtures/cube'

describe('calcAverageStatistics', () => {
  it('returns 0 for every scope when cubesDB is null', () => {
    expect(calcAverageStatistics({ cubesDB: null, category: '3x3', cubeName: 'A' })).toEqual({
      global: 0,
      session: 0,
      cubeAll: 0,
      cubeSession: 0
    })
  })

  it('computes the arithmetic mean for the target cube excluding DNFs', () => {
    const cubeA = makeCube({
      name: 'A',
      category: '3x3',
      sessionSolves: [makeSolve({ time: 1000 }), makeSolve({ time: 2000 })],
      allSolves: [makeSolve({ time: 3000 }), makeSolve({ time: 99999, dnf: true })]
    })
    const result = calcAverageStatistics({ cubesDB: [cubeA], category: '3x3', cubeName: 'A' })
    // session: (1000+2000)/2 = 1500
    // cubeAll: (1000+2000+3000)/3 = 2000 (DNF excluded)
    expect(result.session).toBe(1500)
    expect(result.cubeAll).toBe(2000)
    expect(result.cubeSession).toBe(1500)
    expect(result.global).toBe(2000)
  })

  it('returns 0 for a scope when every solve in it is a DNF', () => {
    const cube = makeCube({
      name: 'A',
      category: '3x3',
      sessionSolves: [makeSolve({ time: 1000, dnf: true })]
    })
    const result = calcAverageStatistics({ cubesDB: [cube], category: '3x3', cubeName: 'A' })
    // Filtered arrays are empty → division by zero produces NaN → falls back to 0
    expect(result.session).toBe(0)
    expect(result.cubeSession).toBe(0)
    expect(result.cubeAll).toBe(0)
    expect(result.global).toBe(0)
  })

  it('returns 0 for cubeAll/cubeSession when the target cube does not exist', () => {
    const cube = makeCube({
      name: 'A',
      category: '3x3',
      sessionSolves: [makeSolve({ time: 1000 })]
    })
    const result = calcAverageStatistics({ cubesDB: [cube], category: '3x3', cubeName: 'Other' })
    expect(result.cubeAll).toBe(0)
    expect(result.cubeSession).toBe(0)
    expect(result.session).toBe(1000)
  })
})
