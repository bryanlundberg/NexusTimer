import calcSuccessRate, { calcSuccessRateFromMetrics } from '@/shared/lib/statistics/calcSuccessRate'
import { makeCube } from './fixtures/cube'
import { makeSolve, makeSolves } from './fixtures/solve'

const metricsOf = (solves: ReturnType<typeof makeSolves>) => ({
  global: solves,
  session: solves,
  cubeAll: solves,
  cubeSession: solves
})

/**
 * Success rate is the share of solves that carry no penalty at all. Note what
 * that means in practice: a +2 counts as a failure here, exactly like a DNF, so
 * a clean session with a few +2s never reads as 100%. That is a product call,
 * not an accident, and these tests are where it is written down.
 */
describe('calcSuccessRate', () => {
  it('is 100% when there are no solves', () => {
    expect(calcSuccessRateFromMetrics(metricsOf([]))).toEqual({
      global: '100',
      session: '100',
      cubeAll: '100',
      cubeSession: '100'
    })
  })

  it('is 100% when every solve is clean', () => {
    expect(calcSuccessRateFromMetrics(metricsOf(makeSolves([1000, 2000, 3000]))).session).toBe('100.00')
  })

  it('counts a DNF as a failure', () => {
    const solves = [...makeSolves([1000, 2000, 3000]), makeSolve({ time: 4000, dnf: true })]
    expect(calcSuccessRateFromMetrics(metricsOf(solves)).session).toBe('75.00')
  })

  it('counts a +2 as a failure too, not as a slower success', () => {
    const solves = [...makeSolves([1000, 2000, 3000]), makeSolve({ time: 4000, plus2: true })]
    expect(calcSuccessRateFromMetrics(metricsOf(solves)).session).toBe('75.00')
  })

  it('is 0% when every solve carries a penalty', () => {
    const solves = [makeSolve({ time: 1000, dnf: true }), makeSolve({ time: 2000, plus2: true })]
    expect(calcSuccessRateFromMetrics(metricsOf(solves)).session).toBe('0.00')
  })

  it('reports two decimals for rates that do not divide cleanly', () => {
    const solves = [...makeSolves([1000, 2000]), makeSolve({ time: 3000, dnf: true })]
    expect(calcSuccessRateFromMetrics(metricsOf(solves)).session).toBe('66.67')
  })

  it('scores each bucket on its own solves', () => {
    const session = [makeSolve({ id: 'a', time: 1000 }), makeSolve({ id: 'b', time: 2000, dnf: true })]
    const all = [...session, makeSolve({ id: 'c', time: 3000 }), makeSolve({ id: 'd', time: 4000 })]

    const result = calcSuccessRateFromMetrics({ global: all, session, cubeAll: all, cubeSession: session })

    expect(result.session).toBe('50.00')
    expect(result.cubeAll).toBe('75.00')
  })

  it('reads solves from the store, skipping deleted ones', () => {
    const cube = makeCube({
      name: 'A',
      category: '3x3',
      sessionSolves: [
        makeSolve({ id: 'live', time: 1000, endTime: 2 }),
        makeSolve({ id: 'gone', time: 2000, endTime: 1, dnf: true, isDeleted: true })
      ]
    })

    // The deleted DNF must not drag the rate down.
    expect(calcSuccessRate({ cubesDB: [cube], category: '3x3', cubeName: 'A' }).cubeSession).toBe('100.00')
  })
})
