import { Solve } from '@/entities/solve/model/types'
import { rollingAoFromTimes, SolveTimes, toSolveTimes } from './rollingAo'

function bestWindow(times: SolveTimes, ao: number): { index: number; value: number } {
  const values = rollingAoFromTimes(times, ao)
  let value = Infinity
  let index = -1
  for (let i = 0; i < values.length; i++) {
    if (values[i] > 0 && values[i] < value) {
      value = values[i]
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

export default function calcBestAo(solves: Solve[], ao: number): number {
  return calcBestAos(solves, [ao])[0]
}
