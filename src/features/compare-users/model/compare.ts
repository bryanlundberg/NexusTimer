import { CubeCategory } from '@/shared/config/cube-categories'

export type CompareUser = {
  [key in CubeCategory]: { single: number; average: number; count: number }
} & {
  _id: string
}
