import { Cube } from '@/entities/cube/model/types'
import { CubeCategory } from '@/shared/config/cube-categories'

export type BarsGraphCategoryProps = {
  cubes: Array<Cube>
  category?: CubeCategory
}
