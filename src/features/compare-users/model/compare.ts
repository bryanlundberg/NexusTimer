import { CubeCategory } from '@/shared/const/cube-categories'

export type CompareUser = {
  [key in CubeCategory]: { single: number; average: number; count: number }
} & {
  _id: string
}
