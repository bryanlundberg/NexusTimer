import { vi, beforeEach, afterEach } from 'vitest'
import importDataFromFile from '@/features/manage-backup/lib/importDataFromFile'
import { makeCube } from './fixtures/cube'
import { makeSolve } from './fixtures/solve'
import { SolveTab } from '@/shared/types/enums'

// cubesDB is IndexedDB-backed; mock it so togglePlus2 can run in isolation.
const { getById, update } = vi.hoisted(() => ({ getById: vi.fn(), update: vi.fn() }))
vi.mock('@/entities/cube/api/indexdb', () => ({ cubesDB: { getById, update } }))

import { togglePlus2 } from '@/features/manage-solves/api/togglePlus2'

/** A File stand-in: the importer only ever calls `text()`. */
const fileOf = (content: string) => ({ text: async () => content }) as unknown as File

const RAW = 10_000
const DATE_SEC = 1_700_000_000

beforeEach(() => {
  getById.mockReset()
  update.mockReset()
  update.mockImplementation(async (cube) => cube)
})

afterEach(() => {
  vi.restoreAllMocks()
})

async function nexusTimerPlus2() {
  const cube = makeCube({ id: 'A', sessionSolves: [makeSolve({ id: 's1', time: RAW })] })
  getById.mockResolvedValue(cube)
  const result = await togglePlus2({ cubeId: 'A', solveId: 's1', plus2: true, solveTab: SolveTab.SESSION })
  const solve = result.solves.session.find((s) => s.id === 's1')!
  return { time: solve.time, plus2: solve.plus2, dnf: solve.dnf }
}

const shapeOf = (solve: { time: number; plus2: boolean; dnf: boolean }) => ({
  time: solve.time,
  plus2: solve.plus2,
  dnf: solve.dnf
})

const csTimerBackup = JSON.stringify({
  session1: [
    [[0, RAW], "R U R' U'", '', DATE_SEC],
    [[2000, RAW], "R U R' U'", '', DATE_SEC + 60]
  ],
  properties: { sessionData: '{}' }
})

const cubeDeskBackup = JSON.stringify({
  sessions: [{ id: 'sess-1', name: 'Main', created_at: '2026-01-01T00:00:00.000Z', order: 1 }],
  solves: [
    {
      scramble: "R U R' U'",
      started_at: 1,
      ended_at: 2,
      time: RAW / 1000,
      raw_time: RAW / 1000,
      cube_type: '333',
      id: 'cd-1',
      dnf: false,
      plus_two: false,
      session_id: 'sess-1',
      from_timer: true
    },
    {
      scramble: "R U R' U'",
      started_at: 3,
      ended_at: 4,
      // CubeDesk resolves the penalty in `time` and keeps the clock in `raw_time`.
      time: (RAW + 2000) / 1000,
      raw_time: RAW / 1000,
      cube_type: '333',
      id: 'cd-2',
      dnf: false,
      plus_two: true,
      session_id: 'sess-1',
      from_timer: true
    }
  ]
})

// Puzzle;Category;Time(millis);Date(millis);Scramble;Penalty (1 = +2);Comment
// Like CubeDesk, the exported time already includes the penalty.
const twistyBackup = [
  'Puzzle,Category,Time(millis),Date(millis),Scramble,Penalty,Comment',
  `"333";"Normal";"${RAW}";"1700000000000";"R U R' U'";"0";""`,
  `"333";"Normal";"${RAW + 2000}";"1700000060000";"R U R' U'";"1";""`
].join('\n')

const solvesOf = async (content: string) => {
  const cubes = await importDataFromFile(fileOf(content))
  if (!cubes) throw new Error('import returned false')
  return cubes.flatMap((cube) => [...cube.solves.all, ...cube.solves.session])
}

describe('imported penalties match the app’s own +2', () => {
  it('csTimer stores the penalised time, like togglePlus2 does', async () => {
    const expected = await nexusTimerPlus2()
    const solves = await solvesOf(csTimerBackup)

    expect(solves).toHaveLength(2)
    expect(shapeOf(solves.find((s) => s.plus2)!)).toEqual(expected)
    expect(solves.find((s) => !s.plus2)!.time).toBe(RAW)
  })

  it('CubeDesk stores the penalised time, like togglePlus2 does', async () => {
    const expected = await nexusTimerPlus2()
    const solves = await solvesOf(cubeDeskBackup)

    expect(solves).toHaveLength(2)
    expect(shapeOf(solves.find((s) => s.plus2)!)).toEqual(expected)
    expect(solves.find((s) => !s.plus2)!.time).toBe(RAW)
  })

  it('Twisty Timer stores the penalised time, like togglePlus2 does', async () => {
    const expected = await nexusTimerPlus2()
    const solves = await solvesOf(twistyBackup)

    expect(solves).toHaveLength(2)
    expect(shapeOf(solves.find((s) => s.plus2)!)).toEqual(expected)
    expect(solves.find((s) => !s.plus2)!.time).toBe(RAW)
  })

  it('agrees across every source: the same solve imports to the same numbers', async () => {
    const shapes = await Promise.all(
      [csTimerBackup, cubeDeskBackup, twistyBackup].map(async (backup) => {
        const solves = await solvesOf(backup)
        return shapeOf(solves.find((s) => s.plus2)!)
      })
    )

    expect(new Set(shapes.map((s) => JSON.stringify(s))).size).toBe(1)
    expect(shapes[0]).toEqual({ time: 12_000, plus2: true, dnf: false })
  })
})
