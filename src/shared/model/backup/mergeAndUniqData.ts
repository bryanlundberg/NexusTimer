import { Cube } from '@/entities/cube/model/types'
import { mergeCubes } from '@/shared/model/backup/mergeCubes'

export async function mergeAndUniqData(backupData: Cube[], localCubesData: Cube[]): Promise<Cube[]> {
  return mergeCubes(backupData, localCubesData)
}
