import { formatCubesDatesAndOrder, preventDuplicateDeleteStatus } from '@/features/manage-backup/lib/importDataFromFile'
import { reconcileSolvesAcrossCubes } from '@/shared/model/backup/reconcileSolvesAcrossCubes'
import { Cube } from '@/entities/cube/model/types'

export async function mergeAndUniqData(backupData: Cube[], localCubesData: Cube[]): Promise<Cube[]> {
  const cubeMap = new Map<string, Cube>()

  for (const cube of [...backupData, ...localCubesData]) {
    const existing = cubeMap.get(cube.id)

    if (!existing) {
      cubeMap.set(cube.id, cube)
      continue
    }

    let baseCube: Cube
    let otherCube: Cube

    const cubeUpdatedAt = cube.updatedAt ?? 0
    const existingUpdatedAt = existing.updatedAt ?? 0

    if (cubeUpdatedAt > existingUpdatedAt) {
      baseCube = cube
      otherCube = existing
    } else if (cubeUpdatedAt < existingUpdatedAt) {
      baseCube = existing
      otherCube = cube
    } else {
      if (existing.isDeleted && !cube.isDeleted) {
        baseCube = cube
        otherCube = existing
      } else if (!existing.isDeleted && cube.isDeleted) {
        baseCube = existing
        otherCube = cube
      } else {
        baseCube = cube
        otherCube = existing
      }
    }

    const finalIsDeleted = baseCube.isDeleted

    cubeMap.set(cube.id, {
      ...baseCube,
      isDeleted: finalIsDeleted,
      solves: {
        session: [...baseCube.solves.session, ...otherCube.solves.session],
        all: [...baseCube.solves.all, ...otherCube.solves.all]
      }
    })
  }

  const mergedCubes = Array.from(cubeMap.values())
  const dedupedPerCube = preventDuplicateDeleteStatus(mergedCubes)
  const reconciled = reconcileSolvesAcrossCubes(dedupedPerCube)
  return formatCubesDatesAndOrder(reconciled)
}
