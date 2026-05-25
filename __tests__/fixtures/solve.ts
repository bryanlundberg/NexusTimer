import { Solve } from '@/entities/solve/model/types'

export function makeSolve(overrides: Partial<Solve> = {}): Solve {
  return {
    id: 'id-' + Math.random().toString(36).slice(2),
    cubeId: 'cube-1',
    scramble: '',
    startTime: 0,
    endTime: 0,
    bookmark: false,
    time: 1000,
    rating: 0,
    dnf: false,
    plus2: false,
    ...overrides
  }
}

export function makeSolves(times: number[], overrides: Partial<Solve> = {}): Solve[] {
  return times.map((t) => makeSolve({ ...overrides, time: t }))
}
