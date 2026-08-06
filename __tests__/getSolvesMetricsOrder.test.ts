import getSolvesMetrics from '@/shared/lib/statistics/getSolvesMetrics'
import calcCurrentAo from '@/shared/lib/statistics/calcCurrentAo'
import { makeCube } from './fixtures/cube'
import { makeSolve } from './fixtures/solve'

/**
 * getSolvesMetrics feeds every statistic, and it promises one thing above all:
 * newest first, by endTime. `calcCurrentAo` is literally `slice(0, 5)` of that
 * output, so if the order slips, the current Ao averages the wrong five solves
 * without anything failing.
 */
const solveAt = (endTime: number, time: number, overrides = {}) =>
  makeSolve({ id: `s-${endTime}`, time, startTime: endTime - time, endTime, ...overrides })

describe('getSolvesMetrics ordering', () => {
  it('returns every bucket newest first', () => {
    const cube = makeCube({
      name: 'A',
      category: '3x3',
      sessionSolves: [solveAt(300, 3000), solveAt(100, 1000), solveAt(200, 2000)],
      allSolves: [solveAt(50, 500), solveAt(150, 1500)]
    })

    const result = getSolvesMetrics({ cubesDB: [cube], category: '3x3', cubeName: 'A' })

    expect(result.session.map((solve) => solve.endTime)).toEqual([300, 200, 100])
    expect(result.cubeSession.map((solve) => solve.endTime)).toEqual([300, 200, 100])
    expect(result.cubeAll.map((solve) => solve.endTime)).toEqual([300, 200, 150, 100, 50])
    expect(result.global.map((solve) => solve.endTime)).toEqual([300, 200, 150, 100, 50])
  })

  it('orders by when the timer stopped, not by when it started', () => {
    // A long solve begins before a short one and finishes after it: the two keys
    // disagree, and endTime is the one the app treats as canonical.
    const long = makeSolve({ id: 'long', startTime: 100, endTime: 900, time: 800 })
    const short = makeSolve({ id: 'short', startTime: 200, endTime: 260, time: 60 })
    const cube = makeCube({ name: 'A', category: '3x3', sessionSolves: [long, short] })

    const result = getSolvesMetrics({ cubesDB: [cube], category: '3x3', cubeName: 'A' })

    expect(result.session.map((solve) => solve.id)).toEqual(['long', 'short'])
  })

  it('interleaves solves from different cubes of the category by endTime', () => {
    const cubeA = makeCube({ name: 'A', category: '3x3', sessionSolves: [solveAt(100, 1000), solveAt(400, 4000)] })
    const cubeB = makeCube({ name: 'B', category: '3x3', sessionSolves: [solveAt(200, 2000), solveAt(300, 3000)] })

    const result = getSolvesMetrics({ cubesDB: [cubeA, cubeB], category: '3x3', cubeName: 'A' })

    expect(result.global.map((solve) => solve.endTime)).toEqual([400, 300, 200, 100])
    // The cube buckets stay scoped to the requested cube.
    expect(result.cubeAll.map((solve) => solve.endTime)).toEqual([400, 100])
  })

  it('hands the current Ao the five most recent solves', () => {
    // 10s ... 60s recorded in that order: the Ao5 must ignore the oldest.
    const cube = makeCube({
      name: 'A',
      category: '3x3',
      sessionSolves: [
        solveAt(1000, 10_000),
        solveAt(2000, 20_000),
        solveAt(3000, 30_000),
        solveAt(4000, 40_000),
        solveAt(5000, 50_000),
        solveAt(6000, 60_000)
      ]
    })

    const { cubeSession } = getSolvesMetrics({ cubesDB: [cube], category: '3x3', cubeName: 'A' })

    // Newest five are 20..60; trimming 20 and 60 leaves 30, 40, 50.
    expect(calcCurrentAo(cubeSession, 5)).toBe(40_000)
  })

  it('leaves deleted solves out of every bucket', () => {
    const cube = makeCube({
      name: 'A',
      category: '3x3',
      sessionSolves: [solveAt(300, 3000), solveAt(200, 2000, { isDeleted: true })],
      allSolves: [solveAt(100, 1000, { isDeleted: true })]
    })

    const result = getSolvesMetrics({ cubesDB: [cube], category: '3x3', cubeName: 'A' })

    expect(result.session.map((solve) => solve.endTime)).toEqual([300])
    expect(result.cubeAll.map((solve) => solve.endTime)).toEqual([300])
    expect(result.global.map((solve) => solve.endTime)).toEqual([300])
  })

  it('keeps DNFs in the list, since dropping them is each statistic’s own call', () => {
    const cube = makeCube({
      name: 'A',
      category: '3x3',
      sessionSolves: [solveAt(200, 2000, { dnf: true }), solveAt(100, 1000)]
    })

    const result = getSolvesMetrics({ cubesDB: [cube], category: '3x3', cubeName: 'A' })

    expect(result.session.map((solve) => solve.dnf)).toEqual([true, false])
  })

  it('does not reorder the caller’s arrays', () => {
    const cube = makeCube({
      name: 'A',
      category: '3x3',
      sessionSolves: [solveAt(100, 1000), solveAt(300, 3000), solveAt(200, 2000)]
    })
    const snapshot = cube.solves.session.map((solve) => solve.endTime)

    getSolvesMetrics({ cubesDB: [cube], category: '3x3', cubeName: 'A' })

    expect(cube.solves.session.map((solve) => solve.endTime)).toEqual(snapshot)
  })
})
