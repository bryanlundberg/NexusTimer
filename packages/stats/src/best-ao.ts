import { rollingAoFromTimes, type SolveTimes, toSolveTimes } from './rolling-ao'
import type { Solve } from './types'

function bestWindow(times: SolveTimes, ao: number): { index: number; value: number } {
  const values = rollingAoFromTimes(times, ao)
  let value = Infinity
  let index = -1
  for (let i = 0; i < values.length; i++) {
    const current = values[i]!
    if (current > 0 && current < value) {
      value = current
      index = i
    }
  }
  return { index, value }
}

export function findBestAoWindow<T extends Solve>(solves: T[], ao: number): T[] | null {
  if (!solves || solves.length < ao || ao < 3) return null
  const { index } = bestWindow(toSolveTimes(solves), ao)
  return index === -1 ? null : solves.slice(index, index + ao)
}

export function calcBestAos(solves: Solve[], sizes: number[]): number[] {
  const times = solves ? toSolveTimes(solves) : null
  return sizes.map((ao) => (!times || times.values.length < ao || ao < 3 ? 0 : bestWindow(times, ao).value))
}

export function calcBestAo(solves: Solve[], ao: number): number {
  return calcBestAos(solves, [ao])[0]!
}
