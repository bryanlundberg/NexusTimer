import { backupFragment, type CurrentBackup } from '@nexustimer/contracts'
import { importNexusTimerData, normalizeOldData } from '@/features/manage-backup/lib/importDataFromFile'
import { Cube } from '@/entities/cube/model/types'
import { cubesDB } from '@/entities/cube/api/indexdb'
import { mergeCubes } from '@/shared/model/backup/mergeCubes'
import { writeSyncMarker } from '@/shared/model/backup/syncMarker'
import { applyCubesToStore } from '@/shared/model/backup/applyCubesToStore'
import { announceCubesChanged } from '@/shared/model/backup/cubesChannel'

export type ApplyRemoteResult =
  { status: 'merged'; added: number } | { status: 'unreachable' } | { status: 'unreadable' }

export const countLiveSolves = (cubes: Cube[]) =>
  cubes
    .filter((cube) => !cube.isDeleted)
    .reduce(
      (total, cube) =>
        total +
        cube.solves.session.filter((solve) => !solve.isDeleted).length +
        cube.solves.all.filter((solve) => !solve.isDeleted).length,
      0
    )

export async function applyRemoteBackup(userId: string, backup: CurrentBackup): Promise<ApplyRemoteResult> {
  let text: string
  try {
    const res = await fetch(backup.url)
    if (!res.ok) throw new Error(`Download failed with status ${res.status}`)
    text = await res.text()
  } catch (error) {
    console.error(error)
    return { status: 'unreachable' }
  }

  let added = 0
  try {
    const remote = normalizeOldData(importNexusTimerData(text))
    const live = await cubesDB.transformAll((stored) => {
      const local = normalizeOldData(stored)
      const merged = mergeCubes(remote, local)
      added = Math.max(0, countLiveSolves(merged) - countLiveSolves(local))
      return merged
    })
    await writeSyncMarker(userId, backupFragment(backup.url))
    applyCubesToStore(live)
    announceCubesChanged()
  } catch (error) {
    console.error(error)
    return { status: 'unreadable' }
  }

  return { status: 'merged', added }
}
