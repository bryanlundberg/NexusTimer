import { CubeCategory } from '@/shared/const/cube-categories'
import { Solves } from '@/entities/solve/model/types'

export type { Cube } from '@nexustimer/stats'

export type CreateCubeDTO = {
  name: string
  category: CubeCategory
}

export type UpdateCubeDTO = {
  id: string
  name?: string
  category?: CubeCategory
  isDeleted?: boolean
  favorite?: boolean
  solves?: Solves
}

export type DeleteCubeDTO = {
  id: string
}
