import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { Solve } from '@/entities/solve/model/types'
import { Cube } from '@/entities/cube/model/types'
import importDataFromFile from '@/features/manage-backup/lib/importDataFromFile'

const backup = (name: string) => readFileSync(join(process.cwd(), '__tests__/bks', name), 'utf8')

const fileOf = (content: string) => ({ text: async () => content }) as unknown as File

const importBackup = async (name: string) => {
  const cubes = (await importDataFromFile(fileOf(backup(name)))) as Cube[] | false
  if (!cubes) throw new Error(`${name} failed to import`)
  return cubes
}

const allSolves = (cubes: Cube[]): Solve[] => cubes.flatMap((cube) => [...cube.solves.all, ...cube.solves.session])

describe('csTimer backup', () => {
  let cubes: Cube[]
  let solves: Solve[]

  beforeAll(async () => {
    cubes = await importBackup('cstimer.txt')
    solves = allSolves(cubes)
  })

  it('creates one cube per non-empty session and skips the empty ones', () => {
    // The backup holds 15 sessions, only 3 of them with solves.
    expect(cubes).toHaveLength(3)
    expect(cubes.map((cube) => cube.solves.all.length).sort((a, b) => a - b)).toEqual([1, 1, 12])
  })

  it('imports every solve exactly once', () => {
    expect(solves).toHaveLength(14)
    expect(new Set(solves.map((solve) => solve.id)).size).toBe(14)
  })

  it('keeps clean times untouched', () => {
    const clean = solves.filter((solve) => !solve.dnf && !solve.plus2)
    expect(clean).toHaveLength(13)
    expect(clean.map((solve) => solve.time)).toContain(462)
    expect(clean.map((solve) => solve.time)).toContain(14250)
  })

  it('marks the DNF and keeps its clock reading as a positive duration', () => {
    const dnfs = solves.filter((solve) => solve.dnf)
    expect(dnfs).toHaveLength(1)
    expect(dnfs[0].time).toBe(45690)
    expect(dnfs[0].plus2).toBe(false)
  })

  it('never produces a negative or zero time', () => {
    expect(solves.every((solve) => solve.time > 0)).toBe(true)
  })

  it('leaves no solve carrying both penalties', () => {
    expect(solves.some((solve) => solve.dnf && solve.plus2)).toBe(false)
  })
})

describe('CubeDesk backup', () => {
  let cubes: Cube[]
  let solves: Solve[]

  beforeAll(async () => {
    cubes = await importBackup('cubedesk.txt')
    solves = allSolves(cubes)
  })

  it('creates one cube per session, including the empty ones', () => {
    expect(cubes).toHaveLength(21)
  })

  it('imports every solve exactly once', () => {
    expect(solves).toHaveLength(450)
    expect(new Set(solves.map((solve) => solve.id)).size).toBe(450)
  })

  it('applies the +2 exactly once, on top of the raw time', () => {
    // CubeDesk already resolves the penalty in `time` (raw_time + 2), so importing
    // that field and adding the penalty again would land 2s late.
    const penalised = solves.filter((solve) => solve.plus2)
    expect(penalised).toHaveLength(5)
    expect(penalised.map((solve) => solve.time).sort((a, b) => a - b)).toEqual([2276, 2908, 3128, 4200, 12140])
  })

  it('gives a DNF a real duration instead of CubeDesk’s -1 sentinel', () => {
    const dnfs = solves.filter((solve) => solve.dnf)
    expect(dnfs).toHaveLength(4)
    expect(dnfs.map((solve) => solve.time).sort((a, b) => a - b)).toEqual([847, 1064, 15470, 59990])
  })

  it('lets the DNF win when CubeDesk marks a solve as both DNF and +2', () => {
    const both = solves.find((solve) => solve.id === '708a7ebb-dd3d-4b2b-ac21-ee228cb9ae00')!
    expect(both.dnf).toBe(true)
    expect(both.plus2).toBe(false)
    expect(both.time).toBe(847)
  })

  it('never produces a negative or zero time', () => {
    expect(solves.every((solve) => solve.time > 0)).toBe(true)
  })

  it('keeps clean solves at their raw millisecond value', () => {
    const clean = solves.filter((solve) => !solve.dnf && !solve.plus2)
    expect(clean).toHaveLength(441)
    expect(clean.every((solve) => Number.isInteger(solve.time))).toBe(true)
  })
})

describe('Twisty Timer backup', () => {
  let cubes: Cube[]
  let solves: Solve[]

  beforeAll(async () => {
    cubes = await importBackup('twistytimer.txt')
    solves = allSolves(cubes)
  })

  it('parses the semicolon-quoted rows into one cube per puzzle and category', () => {
    expect(cubes.map((cube) => cube.name).sort()).toEqual(['333-Normal', 'clock-Normal'])
  })

  it('skips the placeholder row with a zero time', () => {
    // The export opens with a 222 row of 0 ms, which is not a solve.
    expect(solves).toHaveLength(17)
    expect(new Set(solves.map((solve) => solve.id)).size).toBe(17)
    expect(cubes.some((cube) => cube.name.startsWith('222'))).toBe(false)
  })

  it('does not re-apply a +2 that the export already resolved', () => {
    // Clean clock solves sit between 1260 and 1630 ms while the two penalised ones
    // export as 3340 and 3386, i.e. the clock reading plus the two seconds.
    const penalised = solves.filter((solve) => solve.plus2)
    expect(penalised.map((solve) => solve.time).sort((a, b) => a - b)).toEqual([3340, 3386])
  })

  it('keeps the DNF flag without touching its time', () => {
    const dnfs = solves.filter((solve) => solve.dnf)
    expect(dnfs).toHaveLength(1)
    expect(dnfs[0].time).toBe(1393)
    expect(dnfs[0].plus2).toBe(false)
  })

  it('never produces a negative or zero time', () => {
    expect(solves.every((solve) => solve.time > 0)).toBe(true)
  })

  it('leaves no solve carrying both penalties', () => {
    expect(solves.some((solve) => solve.dnf && solve.plus2)).toBe(false)
  })
})
