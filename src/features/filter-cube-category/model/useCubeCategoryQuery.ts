import { useQueryState } from 'nuqs'
import { STATES } from '@/shared/const/states'
import { CUBE_CATEGORIES, CubeCategory } from '@/shared/const/cube-categories'
import type { CubeCategoryFilterValue } from '@/features/filter-cube-category/ui/CubeCategoryFilter'

export function useCubeCategoryQuery() {
  const [raw, setRaw] = useQueryState(STATES.CUBES_PAGE.CATEGORY.KEY, {
    defaultValue: STATES.CUBES_PAGE.CATEGORY.DEFAULT_VALUE
  })

  const value: CubeCategoryFilterValue = CUBE_CATEGORIES.includes(raw as CubeCategory) ? (raw as CubeCategory) : 'all'

  return [value, (next: CubeCategoryFilterValue) => setRaw(next)] as const
}
