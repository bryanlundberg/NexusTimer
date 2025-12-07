import { Cube } from '@/entities/cube/model/types'
import { CubeCategory } from '@/shared/const/cube-categories'

export type BarsGraphCategoryProps = {
  cubes: Array<Cube>
  category?: CubeCategory
}
