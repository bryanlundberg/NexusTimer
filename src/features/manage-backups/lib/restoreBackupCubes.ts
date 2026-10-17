import { Cube } from '@/entities/cube/model/types'
import { Solve } from '@/entities/solve/model/types'

export function restoreBackupCubes(backup: Cube[], local: Cube[], now: number): Cube[] {
  const touch = (solve: Solve): Solve => ({ ...solve, updatedAt: now })
  const tombstone = (solve: Solve): Solve => ({ ...solve, isDeleted: true, updatedAt: now })
  const backupById = new Map(backup.map((cube) => [cube.id, cube]))
  const localById = new Map(local.map((cube) => [cube.id, cube]))

  const restored = backup.map((cube) => {
    const kept = new Set([...cube.solves.session, ...cube.solves.all].map((solve) => solve.id))
    const dropped = (solves: Solve[] = []) => solves.filter((solve) => !kept.has(solve.id)).map(tombstone)
    const localCube = localById.get(cube.id)

    return {
      ...cube,
      updatedAt: now,
      solves: {
        session: [...cube.solves.session.map(touch), ...dropped(localCube?.solves.session)],
        all: [...cube.solves.all.map(touch), ...dropped(localCube?.solves.all)]
      }
    }
  })

  const removed = local
    .filter((cube) => !backupById.has(cube.id))
    .map((cube) => ({
      ...cube,
      isDeleted: true,
      updatedAt: now,
      solves: { session: cube.solves.session.map(tombstone), all: cube.solves.all.map(tombstone) }
    }))

  return [...restored, ...removed]
}
