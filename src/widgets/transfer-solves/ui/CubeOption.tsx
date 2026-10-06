import { Cube } from '@/entities/cube/model/types'
import { CategoryBadge } from '@/shared/ui/category-badge/CategoryBadge'
import { CubeCategoryIcon } from '@/shared/ui/cube-category-icon/CubeCategoryIcon'

interface CubeOptionProps {
  cube: Cube
}

export default function CubeOption({ cube }: CubeOptionProps) {
  return (
    <div className="flex w-full items-center gap-2">
      <CubeCategoryIcon category={cube.category} className="size-5" />
      <span className="truncate">{cube.name}</span>
      <CategoryBadge category={cube.category} className="ms-auto" />
    </div>
  )
}
