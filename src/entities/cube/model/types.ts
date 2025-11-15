import { CubeCategory } from '@/shared/config/cube-categories'
import { Categories } from '@/interfaces/Categories'
import { Solves } from '@/interfaces/Solves'

export type Cube = {
  id: string
  name: string
  category: Categories
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
