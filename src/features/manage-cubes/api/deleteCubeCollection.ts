import { cubesDB } from '@/entities/cube/api/indexdb'
import { DeleteCubeDTO } from '@/entities/cube/model/types'

export async function deleteCubeCollection({ id }: DeleteCubeDTO): Promise<void> {
  const cubeToDelete = await cubesDB.getById(id)
  if (!cubeToDelete) throw new Error('Cube not found')

  const deletedCube = {
    ...cubeToDelete,
    isDeleted: true,
    updatedAt: Date.now()
  }

  await cubesDB.update(deletedCube)
}
