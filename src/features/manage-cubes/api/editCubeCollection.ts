import { Cube } from '@/interfaces/Cube'
import { UpdateCubeDTO } from '@/entities/cube/model/types'
import { cubesDB } from '@/entities/cube/api/indexdb'

export async function editCubeCollection(dto: UpdateCubeDTO): Promise<Cube> {
  const editedCube = await cubesDB.getById(dto.id)
  if (!editedCube) throw new Error('Cube not found')

  const updatedCube: Cube = {
    ...editedCube,
    ...dto,
    updatedAt: Date.now()
  }

  await cubesDB.update(updatedCube)
  return updatedCube
}
