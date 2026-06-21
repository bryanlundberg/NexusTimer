vi.mock('pretty-ms', () => ({
  __esModule: true,
  default: (ms: number) => `${ms}ms`
}))

import calcTimeSpentStatistics from '@/shared/lib/statistics/calcTimeSpentStatistics'
import { makeSolve } from './fixtures/solve'
import { makeCube } from './fixtures/cube'

describe('calcTimeSpentStatistics', () => {
  it('reports 0 for every scope when cubesDB is null', () => {
    expect(calcTimeSpentStatistics({ cubesDB: null, category: '3x3', cubeName: 'A' })).toEqual({
      global: '0ms',
      session: '0ms',
      cubeAll: '0ms',
      cubeSession: '0ms'
    })
  })

  it('sums solve times per scope and forwards the total to pretty-ms', () => {
    const cube = makeCube({
      name: 'A',
      category: '3x3',
      sessionSolves: [makeSolve({ time: 60000 }), makeSolve({ time: 65500 })]
    })
    const result = calcTimeSpentStatistics({ cubesDB: [cube], category: '3x3', cubeName: 'A' })
    // total = 125500 ms across global/session/cubeAll/cubeSession (same single cube)
    expect(result.session).toBe('125500ms')
    expect(result.cubeSession).toBe('125500ms')
    expect(result.global).toBe('125500ms')
    expect(result.cubeAll).toBe('125500ms')
  })

  it('includes DNF solves in the total (no DNF filtering)', () => {
    const cube = makeCube({
      name: 'A',
      category: '3x3',
      sessionSolves: [makeSolve({ time: 1000 }), makeSolve({ time: 60000, dnf: true })]
    })
    const result = calcTimeSpentStatistics({ cubesDB: [cube], category: '3x3', cubeName: 'A' })
    expect(result.session).toBe('61000ms')
  })

  it('separates global and cubeAll totals across different cubes in the same category', () => {
    const cubeA = makeCube({
      name: 'A',
      category: '3x3',
      sessionSolves: [makeSolve({ time: 1000 })]
    })
    const cubeB = makeCube({
      name: 'B',
      category: '3x3',
      sessionSolves: [makeSolve({ time: 2000 })]
    })
    const result = calcTimeSpentStatistics({ cubesDB: [cubeA, cubeB], category: '3x3', cubeName: 'A' })
    expect(result.global).toBe('3000ms')
    expect(result.cubeAll).toBe('1000ms')
  })
})
