import { backupFragment, isBackupSuffix } from '@nexustimer/contracts'
import { createPullScheduler } from '@/shared/model/backup/pullScheduler'
import { isBehind } from '@/shared/model/backup/pullIfBehind'
import { canSyncNow } from '@/shared/model/backup/waitForSyncWindow'
import { countLiveSolves } from '@/shared/model/backup/applyRemoteBackup'
import { newBackupSuffix } from '@/shared/lib/backup/newBackupSuffix'
import { TimerStatus } from '@/features/timer/model/enums'
import { Cube } from '@/entities/cube/model/types'

const SUFFIX = '0123456789abcdef0123456789abcdef'
const url = (suffix: string) => `https://files.test/backups/u1/20261114T100000Z-${suffix}.json`
const backup = (suffix: string) => ({ url: url(suffix), updatedAt: 1 })

describe('backup identity', () => {
  it('reads the random fragment the file name already carries', () => {
    expect(backupFragment(url(SUFFIX))).toBe(SUFFIX)
    expect(backupFragment('https://files.test/legacy.json')).toBe('https://files.test/legacy.json')
  })

  it('generates suffixes in the exact shape the server names files with', () => {
    const suffixes = new Set(Array.from({ length: 50 }, newBackupSuffix))
    expect(suffixes.size).toBe(50)
    for (const suffix of suffixes) expect(isBackupSuffix(suffix)).toBe(true)
    expect(isBackupSuffix('ABCDEF0123456789abcdef0123456789')).toBe(false)
    expect(isBackupSuffix('../x')).toBe(false)
    expect(isBackupSuffix(null)).toBe(false)
  })

  it('pulls only when the server points at a backup this device does not hold', () => {
    expect(isBehind(null, null)).toBe(false)
    expect(isBehind(backup(SUFFIX), SUFFIX)).toBe(false)
    expect(isBehind(backup(SUFFIX), null)).toBe(true)
    expect(isBehind(backup(SUFFIX), 'f'.repeat(32))).toBe(true)
  })
})

describe('sync window', () => {
  it('waits for loaded cubes and a timer at rest', () => {
    expect(canSyncNow({ cubes: [], timerStatus: TimerStatus.IDLE, isSolving: false })).toBe(true)
    expect(canSyncNow({ cubes: null, timerStatus: TimerStatus.IDLE, isSolving: false })).toBe(false)
    expect(canSyncNow({ cubes: [], timerStatus: TimerStatus.INSPECTING, isSolving: false })).toBe(false)
    expect(canSyncNow({ cubes: [], timerStatus: TimerStatus.IDLE, isSolving: true })).toBe(false)
  })
})

describe('countLiveSolves', () => {
  it('skips deleted cubes and deleted solves', () => {
    const solve = (id: string, isDeleted = false) => ({ id, isDeleted }) as Cube['solves']['all'][number]
    const cubes = [
      { id: 'a', solves: { session: [solve('1'), solve('2', true)], all: [solve('3')] } },
      { id: 'b', isDeleted: true, solves: { session: [solve('4')], all: [] } }
    ] as Cube[]
    expect(countLiveSolves(cubes)).toBe(2)
  })
})

describe('createPullScheduler', () => {
  beforeEach(() => vi.useFakeTimers())
  afterEach(() => vi.useRealTimers())

  const setup = () => {
    const runs: (string | undefined)[] = []
    let release: () => void = () => {}
    let gate: Promise<void> = Promise.resolve()
    const scheduler = createPullScheduler({
      ready: () => gate,
      run: async (known) => {
        runs.push(known ? backupFragment(known.url) : undefined)
      }
    })
    const block = () => {
      gate = new Promise((resolve) => (release = resolve))
    }
    return { scheduler, runs, block, release: () => release() }
  }

  it('coalesces a burst into one run and prefers a fresh lookup over a pushed pointer', async () => {
    const { scheduler, runs } = setup()

    scheduler.request(backup(SUFFIX))
    scheduler.request()
    scheduler.request(backup('f'.repeat(32)))
    await vi.advanceTimersByTimeAsync(1000)

    expect(runs).toEqual([undefined])
  })

  it('uses the latest pushed pointer when nothing asked for a fresh lookup', async () => {
    const { scheduler, runs } = setup()

    scheduler.request(backup('f'.repeat(32)))
    scheduler.request(backup(SUFFIX))
    await vi.advanceTimersByTimeAsync(1000)

    expect(runs).toEqual([SUFFIX])
  })

  it('holds the run until the device is ready and folds in what arrives meanwhile', async () => {
    const { scheduler, runs, block, release } = setup()
    block()

    scheduler.request(backup('f'.repeat(32)))
    await vi.advanceTimersByTimeAsync(1000)
    scheduler.request(backup(SUFFIX))
    expect(runs).toEqual([])

    release()
    await vi.advanceTimersByTimeAsync(5000)
    expect(runs).toEqual([SUFFIX])
  })

  it('runs again for a request that lands during a run, and never after dispose', async () => {
    const runs: number[] = []
    let finish: () => void = () => {}
    const scheduler = createPullScheduler({
      ready: async () => {},
      run: () =>
        new Promise<void>((resolve) => {
          runs.push(runs.length)
          finish = resolve
        })
    })

    scheduler.request()
    await vi.advanceTimersByTimeAsync(1000)
    scheduler.request()
    finish()
    await vi.advanceTimersByTimeAsync(1000)
    expect(runs).toEqual([0, 1])

    finish()
    scheduler.dispose()
    scheduler.request()
    await vi.advanceTimersByTimeAsync(5000)
    expect(runs).toEqual([0, 1])
  })
})
