import { vi, beforeEach, afterEach } from 'vitest'
import { readdirSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import { PLUS_2_PENALTY_MS, withPlus2, withoutPlus2 } from '@/entities/solve/lib/penalty'
import { makeCube } from './fixtures/cube'
import { makeSolve, makeSolves } from './fixtures/solve'
import getMean from '@/shared/lib/statistics/getMean'
import getDeviation from '@/shared/lib/statistics/getDeviation'
import { calcAverageFromMetrics } from '@/shared/lib/statistics/calcAverageStatistics'
import { calcTimeSpentFromMetrics } from '@/shared/lib/statistics/calcTimeSpentStatistics'
import { calcAoFromWindow } from '@/shared/lib/statistics/getAoTolerance'
import { SolveTab } from '@/shared/types/enums'

vi.mock('pretty-ms', () => ({ __esModule: true, default: (ms: number) => `${ms}ms` }))

// cubesDB is IndexedDB-backed; mock it so the penalty logic can be tested in isolation.
const { getById, update } = vi.hoisted(() => ({ getById: vi.fn(), update: vi.fn() }))
vi.mock('@/entities/cube/api/indexdb', () => ({ cubesDB: { getById, update } }))

import { togglePlus2 } from '@/features/manage-solves/api/togglePlus2'
import { toggleDNF } from '@/features/manage-solves/api/toggleDNF'

beforeEach(() => {
  getById.mockReset()
  update.mockReset()
  update.mockImplementation(async (cube) => cube)
})

afterEach(() => {
  vi.restoreAllMocks()
})

const metricsOf = (solves: ReturnType<typeof makeSolves>) => ({
  global: solves,
  session: solves,
  cubeAll: solves,
  cubeSession: solves
})

describe('+2 penalty helpers', () => {
  it('adds exactly two seconds when the flag is set', () => {
    expect(withPlus2(10_000, true)).toBe(12_000)
    expect(PLUS_2_PENALTY_MS).toBe(2000)
  })

  it('leaves the time untouched when there is no penalty', () => {
    expect(withPlus2(10_000, false)).toBe(10_000)
    expect(withoutPlus2(10_000, false)).toBe(10_000)
  })

  it('round-trips a penalised time', () => {
    expect(withoutPlus2(withPlus2(8_420, true), true)).toBe(8_420)
  })
})

describe('togglePlus2 keeps time and flag in sync', () => {
  it('bakes the penalty into the stored time when applying it', async () => {
    const cube = makeCube({ id: 'A', sessionSolves: [makeSolve({ id: 's1', time: 10_000 })] })
    getById.mockResolvedValue(cube)

    const result = await togglePlus2({ cubeId: 'A', solveId: 's1', plus2: true, solveTab: SolveTab.SESSION })
    const solve = result.solves.session.find((s) => s.id === 's1')!

    expect(solve.time).toBe(12_000)
    expect(solve.plus2).toBe(true)
  })

  it('removes the penalty from the stored time when clearing it', async () => {
    const cube = makeCube({ id: 'A', sessionSolves: [makeSolve({ id: 's1', time: 12_000, plus2: true })] })
    getById.mockResolvedValue(cube)

    const result = await togglePlus2({ cubeId: 'A', solveId: 's1', plus2: false, solveTab: SolveTab.SESSION })
    const solve = result.solves.session.find((s) => s.id === 's1')!

    expect(solve.time).toBe(10_000)
    expect(solve.plus2).toBe(false)
  })

  it('clears a DNF when a +2 is applied on top of it', async () => {
    const cube = makeCube({ id: 'A', sessionSolves: [makeSolve({ id: 's1', time: 10_000, dnf: true })] })
    getById.mockResolvedValue(cube)

    const result = await togglePlus2({ cubeId: 'A', solveId: 's1', plus2: true, solveTab: SolveTab.SESSION })
    const solve = result.solves.session.find((s) => s.id === 's1')!

    expect(solve.dnf).toBe(false)
    expect(solve.time).toBe(12_000)
  })
})

describe('toggleDNF keeps the exclusivity rule', () => {
  it('strips a previous +2 from the stored time when marking a DNF', async () => {
    const cube = makeCube({ id: 'A', sessionSolves: [makeSolve({ id: 's1', time: 12_000, plus2: true })] })
    getById.mockResolvedValue(cube)

    const result = await toggleDNF({ cubeId: 'A', solveId: 's1', dnf: true, solveTab: SolveTab.SESSION })
    const solve = result.solves.session.find((s) => s.id === 's1')!

    expect(solve.dnf).toBe(true)
    expect(solve.plus2).toBe(false)
    expect(solve.time).toBe(10_000)
  })

  it('leaves a clean solve time untouched', async () => {
    const cube = makeCube({ id: 'A', sessionSolves: [makeSolve({ id: 's1', time: 10_000 })] })
    getById.mockResolvedValue(cube)

    const result = await toggleDNF({ cubeId: 'A', solveId: 's1', dnf: true, solveTab: SolveTab.SESSION })
    const solve = result.solves.session.find((s) => s.id === 's1')!

    expect(solve.time).toBe(10_000)
    expect(solve.dnf).toBe(true)
  })
})

describe('a +2 counts as a normal solve everywhere', () => {
  // 10s solve with a +2 is stored as 12s: every stat must see 12s, not 10s.
  const penalised = [makeSolve({ time: 10_000 }), makeSolve({ time: 12_000, plus2: true })]

  it('counts towards the mean at its penalised value', () => {
    expect(getMean(penalised)).toBe(11_000)
  })

  it('counts towards the deviation at its penalised value', () => {
    expect(getDeviation(penalised)).toBe(1000)
  })

  it('counts towards the average statistic', () => {
    expect(calcAverageFromMetrics(metricsOf(penalised)).session).toBe(11_000)
  })

  it('counts towards total time spent', () => {
    expect(calcTimeSpentFromMetrics(metricsOf(penalised)).session).toBe('22000ms')
  })

  it('counts inside an Ao window', () => {
    // ao5 trims the fastest and slowest, so the penalised 12s stays in the middle
    const window = makeSolves([9_000, 10_000, 12_000, 11_000, 13_000])
    window[2].plus2 = true
    expect(calcAoFromWindow(window, 5)).toBe(11_000)
  })
})

describe('a DNF never reaches an average', () => {
  const withDnf = [makeSolve({ time: 10_000 }), makeSolve({ time: 12_000 }), makeSolve({ time: 60_000, dnf: true })]

  it('is skipped by the mean', () => {
    expect(getMean(withDnf)).toBe(11_000)
  })

  it('is skipped by the deviation', () => {
    expect(getDeviation(withDnf)).toBe(1000)
  })

  it('is skipped by the average statistic', () => {
    expect(calcAverageFromMetrics(metricsOf(withDnf)).session).toBe(11_000)
  })

  it('is trimmed out of an Ao when it fits in the tolerance', () => {
    const window = makeSolves([9_000, 10_000, 11_000, 12_000, 13_000])
    window[4].dnf = true
    // ao5 trims one per side: the DNF goes with the slowest, the 9s with the fastest
    expect(calcAoFromWindow(window, 5)).toBe(11_000)
  })

  it('makes the Ao a DNF when it exceeds the tolerance', () => {
    const window = makeSolves([9_000, 10_000, 11_000, 12_000, 13_000])
    window[3].dnf = true
    window[4].dnf = true
    expect(calcAoFromWindow(window, 5)).toBe(0)
  })

  it('still counts as time spent at the timer', () => {
    expect(calcTimeSpentFromMetrics(metricsOf(withDnf)).session).toBe('82000ms')
  })
})

describe('no reader re-applies the penalty', () => {
  // Rule 2: writers penalise, readers do not. A hand-rolled `+ 2000` on a solve
  // time is how the two conventions drifted apart in the first place.
  const roots = [
    'src/features/free-play-room',
    'src/features/deep-statistics',
    'src/features/manage-backup',
    'src/features/manage-solves',
    'src/shared/lib/statistics',
    'src/widgets/people'
  ]

  const walk = (dir: string): string[] =>
    readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
      const full = join(dir, entry.name)
      if (entry.isDirectory()) return walk(full)
      return /\.tsx?$/.test(entry.name) ? [full] : []
    })

  it('never adds a raw 2000 to a solve time outside the penalty helpers', () => {
    const offenders = roots
      .flatMap((root) => walk(join(process.cwd(), root)))
      .filter((file) => /(?:time|ms)\s*[+\-]\s*2000|2000\s*:\s*0/.test(readFileSync(file, 'utf8')))
      .map((file) => file.replace(process.cwd() + '/', ''))

    expect(offenders).toEqual([])
  })
})
