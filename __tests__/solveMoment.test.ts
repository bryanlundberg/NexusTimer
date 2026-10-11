import { bestBefore } from '@/features/timer/lib/solveMoment'
import { CubeCategory } from '@/shared/const/cube-categories'
import { makeCube } from './fixtures/cube'
import { makeSolve, makeSolves } from './fixtures/solve'

const THREE = '3x3' as CubeCategory

describe('bestBefore', () => {
  it('returns the best valid time in the category, ignoring the current solve', () => {
    const current = makeSolve({ time: 8000 })
    const cubes = [
      makeCube({ allSolves: makeSolves([9500, 11000]), sessionSolves: [current, makeSolve({ time: 9200 })] }),
      makeCube({ allSolves: makeSolves([9100]) })
    ]
    expect(bestBefore(cubes, THREE, current)).toBe(9100)
  })

  it('skips DNFs, deleted solves and other categories', () => {
    const current = makeSolve({ time: 8000 })
    const cubes = [
      makeCube({
        sessionSolves: [current, makeSolve({ time: 7000, dnf: true }), makeSolve({ time: 7500, isDeleted: true })],
        allSolves: makeSolves([10000])
      }),
      makeCube({ category: '2x2' as CubeCategory, allSolves: makeSolves([3000]) })
    ]
    expect(bestBefore(cubes, THREE, current)).toBe(10000)
  })

  it('returns null when there is no earlier valid solve', () => {
    const current = makeSolve({ time: 8000 })
    expect(bestBefore([makeCube({ sessionSolves: [current] })], THREE, current)).toBeNull()
    expect(bestBefore(null, THREE, current)).toBeNull()
  })
})
