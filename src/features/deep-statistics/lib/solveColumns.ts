import { Solve } from '@/entities/solve/model/types'
import { CubeSolves } from '@/features/deep-statistics/model/types'

export type SolveColumns = { times: Float64Array<ArrayBuffer>; flags: Uint8Array<ArrayBuffer> }
export type CubeSolveColumns = Record<keyof CubeSolves, SolveColumns>

const DNF = 1
const PLUS2 = 2
const KEYS: (keyof CubeSolves)[] = ['global', 'session', 'cubeSession', 'cubeAll']

export function toColumns(solves: Solve[]): SolveColumns {
  const times = new Float64Array(solves.length)
  const flags = new Uint8Array(solves.length)
  for (let i = 0; i < solves.length; i++) {
    const solve = solves[i]
    times[i] = solve.time
    flags[i] = (solve.dnf ? DNF : 0) | (solve.plus2 ? PLUS2 : 0)
  }
  return { times, flags }
}

export function fromColumns({ times, flags }: SolveColumns): Solve[] {
  const solves = new Array<Solve>(times.length)
  for (let i = 0; i < times.length; i++) {
    solves[i] = { time: times[i], dnf: (flags[i] & DNF) !== 0, plus2: (flags[i] & PLUS2) !== 0 } as Solve
  }
  return solves
}

export function metricsToColumns(metrics: CubeSolves): { columns: CubeSolveColumns; transfer: ArrayBuffer[] } {
  const columns = {} as CubeSolveColumns
  const transfer: ArrayBuffer[] = []
  for (const key of KEYS) {
    columns[key] = toColumns(metrics[key])
    transfer.push(columns[key].times.buffer, columns[key].flags.buffer)
  }
  return { columns, transfer }
}

export function columnsToMetrics(columns: CubeSolveColumns): CubeSolves {
  return {
    global: fromColumns(columns.global),
    session: fromColumns(columns.session),
    cubeSession: fromColumns(columns.cubeSession),
    cubeAll: fromColumns(columns.cubeAll)
  }
}
