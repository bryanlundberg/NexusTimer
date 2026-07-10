import { CreateCubeDTO, Cube } from '@/entities/cube/model/types'
import { cubesDB } from '@/entities/cube/api/indexdb'
import genId from '@/shared/lib/genId'

export async function createCubeCollection(dto: CreateCubeDTO): Promise<Cube> {
  const newCube: Cube = {
    id: genId(),
    name: dto.name,
    category: dto.category,
    createdAt: Date.now(),
    favorite: false,
    solves: {
      all: [],
      session: []
    },
    updatedAt: Date.now(),
    isDeleted: false
  }

  await cubesDB.add(newCube)

  return newCube
}
