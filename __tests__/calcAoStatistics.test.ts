import calcAoStatistics from '@/shared/lib/statistics/calcAoStatistics'
import { makeSolve } from './fixtures/solve'
import { makeCube } from './fixtures/cube'

describe('calcAoStatistics', () => {
  it('returns 0 for every ao when cubesDB is null', () => {
    const result = calcAoStatistics({ cubesDB: null, category: '3x3', cubeName: 'A' })
    expect(result.global).toEqual({ ao3: 0, ao5: 0, ao12: 0, ao50: 0, ao100: 0, ao1000: 0 })
    expect(result.session).toEqual({ ao3: 0, ao5: 0, ao12: 0, ao50: 0, ao100: 0, ao1000: 0 })
    expect(result.cubeAll).toEqual({ ao3: 0, ao5: 0, ao12: 0, ao50: 0, ao100: 0, ao1000: 0 })
    expect(result.cubeSession).toEqual({ ao3: 0, ao5: 0, ao12: 0, ao50: 0, ao100: 0, ao1000: 0 })
  })

  it('returns 0 for ao values larger than the available solves', () => {
    const cube = makeCube({
      name: 'A',
      category: '3x3',
      sessionSolves: [makeSolve({ time: 1000 }), makeSolve({ time: 2000 })]
    })
    const result = calcAoStatistics({ cubesDB: [cube], category: '3x3', cubeName: 'A' })
    expect(result.session.ao3).toBe(0)
    expect(result.session.ao5).toBe(0)
    expect(result.session.ao12).toBe(0)
  })

  it('computes the best Ao for each scope from the underlying solves', () => {
    const cube = makeCube({
      name: 'A',
      category: '3x3',
      sessionSolves: [
        makeSolve({ time: 1000 }),
        makeSolve({ time: 2000 }),
        makeSolve({ time: 3000 }),
        makeSolve({ time: 4000 }),
        makeSolve({ time: 5000 })
      ]
    })
    const result = calcAoStatistics({ cubesDB: [cube], category: '3x3', cubeName: 'A' })
    // ao3: best window trim mean from [1000,2000,3000] → 2000
    expect(result.session.ao3).toBe(2000)
    // ao5: single window trim mean → [2000,3000,4000] → 3000
    expect(result.session.ao5).toBe(3000)
    // ao12+: not enough solves → 0
    expect(result.session.ao12).toBe(0)
    expect(result.session.ao1000).toBe(0)
  })
})
