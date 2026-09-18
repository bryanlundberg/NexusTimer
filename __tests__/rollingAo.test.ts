import type { Solve } from '@/entities/solve/model/types'
import { rollingAo } from '@/shared/lib/statistics/rollingAo'
import calcBestAo, { findBestAoWindow } from '@/shared/lib/statistics/calcBestAo'
import { calcAoFromWindow } from '@/shared/lib/statistics/getAoTolerance'
import { makeSolve } from './fixtures/solve'

function rng(seed: number) {
  let state = seed
  return () => {
    state = (state * 1664525 + 1013904223) % 4294967296
    return state / 4294967296
  }
}

function referenceBest(solves: Solve[], ao: number): { value: number; index: number } {
  let value = Infinity
  let index = -1
  for (let i = 0; i + ao <= solves.length; i++) {
    const windowAo = calcAoFromWindow(solves.slice(i, i + ao), ao)
    if (windowAo > 0 && windowAo < value) {
      value = windowAo
      index = i
    }
  }
  return { value, index }
}

function randomSolves(random: () => number, count: number, dnfRate: number, integers: boolean): Solve[] {
  return Array.from({ length: count }, (_, i) =>
    makeSolve({
      id: `s-${i}`,
      time: integers ? Math.round(8_000 + random() * 6_000) : 8_000 + random() * 6_000,
      dnf: random() < dnfRate
    })
  )
}

const SIZES = [3, 5, 12, 50, 100]

describe('rollingAo', () => {
  it('matches calcAoFromWindow on every window, bit for bit', () => {
    const random = rng(11)
    for (const integers of [true, false]) {
      for (const dnfRate of [0, 0.05, 0.3]) {
        const solves = randomSolves(random, 400, dnfRate, integers)
        for (const ao of SIZES) {
          const values = rollingAo(solves, ao)
          expect(values.length).toBe(solves.length - ao + 1)
          for (let i = 0; i < values.length; i++) {
            expect(values[i]).toBe(calcAoFromWindow(solves.slice(i, i + ao), ao))
          }
        }
      }
    }
  })

  it('handles repeated times and a window made only of DNFs', () => {
    const solves = [...Array(6)].map((_, i) => makeSolve({ id: `r-${i}`, time: 10_000, dnf: i >= 3 }))
    const values = rollingAo(solves, 3)
    expect(Array.from(values)).toEqual([10_000, 0, 0, 0])
  })

  it('returns an empty result when there are not enough solves', () => {
    expect(rollingAo([makeSolve(), makeSolve()], 3).length).toBe(0)
    expect(rollingAo([makeSolve(), makeSolve(), makeSolve()], 2).length).toBe(0)
  })
})

describe('calcBestAo and findBestAoWindow', () => {
  it('agree with the window-by-window reference, including which window wins a tie', () => {
    const random = rng(23)
    for (let round = 0; round < 20; round++) {
      const solves = randomSolves(random, 60 + Math.floor(random() * 200), random() * 0.2, round % 2 === 0)
      for (const ao of SIZES) {
        if (solves.length < ao) continue
        const reference = referenceBest(solves, ao)
        expect(calcBestAo(solves, ao)).toBe(reference.value)
        const window = findBestAoWindow(solves, ao)
        if (reference.index === -1) expect(window).toBeNull()
        else
          expect(window!.map((solve) => solve.id)).toEqual(
            solves.slice(reference.index, reference.index + ao).map((solve) => solve.id)
          )
      }
    }
  })

  it('keeps the edge results: 0 below the size, Infinity when every window is a DNF', () => {
    expect(calcBestAo([makeSolve()], 5)).toBe(0)
    expect(
      calcBestAo(
        [...Array(3)].map(() => makeSolve({ dnf: true })),
        3
      )
    ).toBe(Infinity)
  })
})
