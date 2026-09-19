import { Solve } from '@/entities/solve/model/types'
import getAoTolerance from './getAoTolerance'

export type SolveTimes = { values: Float64Array; exact: boolean }

export function toSolveTimes(solves: Solve[]): SolveTimes {
  const values = new Float64Array(solves.length)
  let exact = true
  for (let i = 0; i < solves.length; i++) {
    const solve = solves[i]
    if (solve.dnf) {
      values[i] = Infinity
    } else {
      values[i] = solve.time
      if (exact && !Number.isInteger(solve.time)) exact = false
    }
  }
  return { values, exact }
}

function lowerBound(values: Float64Array, length: number, target: number): number {
  let low = 0
  let high = length
  while (low < high) {
    const mid = (low + high) >>> 1
    if (values[mid] < target) low = mid + 1
    else high = mid
  }
  return low
}

export function rollingAoFromTimes({ values, exact }: SolveTimes, ao: number): Float64Array {
  const count = values.length - ao + 1
  if (ao < 3 || count <= 0) return new Float64Array(0)

  const trim = getAoTolerance(ao)
  const keptLength = ao - 2 * trim
  const window = values.slice(0, ao).sort()
  const out = new Float64Array(count)
  let dnfs = 0
  let finiteSum = 0
  for (let i = 0; i < ao; i++) {
    if (window[i] === Infinity) dnfs++
    else finiteSum += window[i]
  }

  const replace = (outgoing: number, incoming: number) => {
    if (outgoing === Infinity) dnfs--
    else finiteSum -= outgoing
    if (incoming === Infinity) dnfs++
    else finiteSum += incoming
    let position = lowerBound(window, ao, outgoing)
    if (incoming > outgoing) {
      while (position + 1 < ao && window[position + 1] < incoming) {
        window[position] = window[position + 1]
        position++
      }
    } else {
      while (position > 0 && window[position - 1] > incoming) {
        window[position] = window[position - 1]
        position--
      }
    }
    window[position] = incoming
  }

  const evaluate = (): number => {
    if (dnfs > trim) return 0
    let sum = 0
    if (exact) {
      sum = finiteSum
      for (let i = 0; i < trim; i++) sum -= window[i]
      for (let i = ao - trim; i < ao; i++) if (window[i] !== Infinity) sum -= window[i]
    } else {
      for (let i = trim; i < ao - trim; i++) sum += window[i]
    }
    return sum / keptLength
  }

  out[0] = evaluate()
  for (let i = 1; i < count; i++) {
    replace(values[i - 1], values[i + ao - 1])
    out[i] = evaluate()
  }

  return out
}

export function rollingAo(solves: Solve[], ao: number): Float64Array {
  if (!solves || ao < 3 || solves.length < ao) return new Float64Array(0)
  return rollingAoFromTimes(toSolveTimes(solves), ao)
}
