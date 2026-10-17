import { Cube } from '@/entities/cube/model/types'
import { restoreBackupCubes } from '@/features/manage-backups/lib/restoreBackupCubes'
import { mergeAndUniqData } from '@/shared/model/backup/mergeAndUniqData'
import { makeCube } from './fixtures/cube'
import { makeSolve } from './fixtures/solve'

const NOW = 10_000

const liveCubeIds = (cubes: Cube[]) =>
  cubes
    .filter((cube) => !cube.isDeleted)
    .map((cube) => cube.id)
    .sort()

const liveSolves = (cubes: Cube[]) =>
  cubes
    .filter((cube) => !cube.isDeleted)
    .flatMap((cube) =>
      [...cube.solves.session, ...cube.solves.all]
        .filter((solve) => !solve.isDeleted)
        .map((solve) => `${cube.id}:${solve.id}`)
    )
    .sort()

const restoreThenSync = async (backup: Cube[], current: Cube[]) =>
  mergeAndUniqData(current, restoreBackupCubes(backup, current, NOW))

describe('restoreBackupCubes', () => {
  it('brings back a solve deleted after the backup, also after the next sync', async () => {
    const backup = [makeCube({ id: 'a', updatedAt: 100, allSolves: [makeSolve({ id: 'x', updatedAt: 100 })] })]
    const current = [
      makeCube({ id: 'a', updatedAt: 500, allSolves: [makeSolve({ id: 'x', updatedAt: 500, isDeleted: true })] })
    ]

    expect(liveSolves(restoreBackupCubes(backup, current, NOW))).toEqual(['a:x'])
    expect(liveSolves(await restoreThenSync(backup, current))).toEqual(['a:x'])
  })

  it('brings back a cube deleted after the backup', async () => {
    const backup = [makeCube({ id: 'a', updatedAt: 100, allSolves: [makeSolve({ id: 'x', updatedAt: 100 })] })]
    const current = [
      makeCube({ id: 'a', updatedAt: 500, isDeleted: true, allSolves: [makeSolve({ id: 'x', updatedAt: 100 })] })
    ]

    const synced = await restoreThenSync(backup, current)
    expect(liveCubeIds(synced)).toEqual(['a'])
    expect(liveSolves(synced)).toEqual(['a:x'])
  })

  it('drops solves added after the backup so the next sync does not bring them back', async () => {
    const backup = [makeCube({ id: 'a', updatedAt: 100, allSolves: [makeSolve({ id: 'x', updatedAt: 100 })] })]
    const current = [
      makeCube({
        id: 'a',
        updatedAt: 500,
        sessionSolves: [makeSolve({ id: 'later', updatedAt: 500 })],
        allSolves: [makeSolve({ id: 'x', updatedAt: 100 })]
      })
    ]

    expect(liveSolves(await restoreThenSync(backup, current))).toEqual(['a:x'])
  })

  it('drops cubes created after the backup', async () => {
    const backup = [makeCube({ id: 'a', updatedAt: 100 })]
    const current = [
      makeCube({ id: 'a', updatedAt: 100 }),
      makeCube({ id: 'b', updatedAt: 500, allSolves: [makeSolve({ id: 'y', updatedAt: 500 })] })
    ]

    const synced = await restoreThenSync(backup, current)
    expect(liveCubeIds(synced)).toEqual(['a'])
    expect(liveSolves(synced)).toEqual([])
  })

  it('puts a solve moved after the backup back in its original cube only', async () => {
    const backup = [
      makeCube({ id: 'a', updatedAt: 100, allSolves: [makeSolve({ id: 'x', cubeId: 'a', updatedAt: 100 })] }),
      makeCube({ id: 'b', updatedAt: 100 })
    ]
    const current = [
      makeCube({
        id: 'a',
        updatedAt: 500,
        allSolves: [makeSolve({ id: 'x', cubeId: 'a', updatedAt: 500, isDeleted: true })]
      }),
      makeCube({ id: 'b', updatedAt: 500, allSolves: [makeSolve({ id: 'x', cubeId: 'b', updatedAt: 500 })] })
    ]

    expect(liveSolves(restoreBackupCubes(backup, current, NOW))).toEqual(['a:x'])
    expect(liveSolves(await restoreThenSync(backup, current))).toEqual(['a:x'])
  })

  it('keeps solves that were already deleted in the backup deleted', async () => {
    const backup = [
      makeCube({ id: 'a', updatedAt: 100, allSolves: [makeSolve({ id: 'x', updatedAt: 100, isDeleted: true })] })
    ]
    const current = [makeCube({ id: 'a', updatedAt: 100, allSolves: [makeSolve({ id: 'x', updatedAt: 100 })] })]

    expect(liveSolves(await restoreThenSync(backup, current))).toEqual([])
  })

  it('does not mutate its inputs', () => {
    const backupSolve = makeSolve({ id: 'x', updatedAt: 100 })
    const localSolve = makeSolve({ id: 'later', updatedAt: 500 })
    const backup = [makeCube({ id: 'a', updatedAt: 100, allSolves: [backupSolve] })]
    const local = [makeCube({ id: 'a', updatedAt: 500, allSolves: [localSolve] })]

    restoreBackupCubes(backup, local, NOW)

    expect(backup[0].updatedAt).toBe(100)
    expect(backupSolve.updatedAt).toBe(100)
    expect(localSolve.isDeleted).toBeUndefined()
  })
})
