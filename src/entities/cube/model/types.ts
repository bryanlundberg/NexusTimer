import { CubeCategory } from '@/shared/const/cube-categories'
import { Solves } from '@/entities/solve/model/types'

export type Cube = {
  id: string
  name: string
  category: CubeCategory
  solves: Solves
  createdAt: number
  favorite: boolean
  updatedAt?: number
  isDeleted?: boolean
}

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
