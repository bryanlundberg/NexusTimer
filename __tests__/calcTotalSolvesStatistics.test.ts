import calcTotalSolvesStatistics from '@/shared/lib/statistics/calcTotalSolvesStatistics'
import { makeSolve } from './fixtures/solve'
import { makeCube } from './fixtures/cube'

describe('calcTotalSolvesStatistics', () => {
  it('returns zeros for every scope when cubesDB is null', () => {
    expect(calcTotalSolvesStatistics({ cubesDB: null, category: '3x3', cubeName: 'A' })).toEqual({
      global: 0,
      session: 0,
      cubeAll: 0,
      cubeSession: 0
    })
  })

  it('counts solves per scope for the target cube', () => {
    const cubeA = makeCube({
      name: 'A',
      category: '3x3',
      sessionSolves: [makeSolve(), makeSolve()],
      allSolves: [makeSolve(), makeSolve(), makeSolve()]
    })
    const cubeB = makeCube({
      name: 'B',
      category: '3x3',
      sessionSolves: [makeSolve()]
    })
    const result = calcTotalSolvesStatistics({ cubesDB: [cubeA, cubeB], category: '3x3', cubeName: 'A' })
    expect(result).toEqual({
      global: 6,
      session: 3,
      cubeAll: 5,
      cubeSession: 2
    })
  })

  it('excludes deleted solves from the counts', () => {
    const cube = makeCube({
      name: 'A',
      category: '3x3',
      sessionSolves: [makeSolve(), makeSolve({ isDeleted: true })],
      allSolves: [makeSolve(), makeSolve({ isDeleted: true })]
    })
    const result = calcTotalSolvesStatistics({ cubesDB: [cube], category: '3x3', cubeName: 'A' })
    expect(result).toEqual({
      global: 2,
      session: 1,
      cubeAll: 2,
      cubeSession: 1
    })
  })
})
