import type { CubeCategory } from '@nexustimer/contracts'
import ChipGroup from '@/shared/ui/chip-group/ChipGroup'
import { CubeCategoryIcon } from '@/shared/ui/cube-category-icon/CubeCategoryIcon'

interface FriendsCategoryChipsProps {
  categories: CubeCategory[]
  selected: CubeCategory
  onSelect: (category: CubeCategory) => void
  label: string
}

export default function FriendsCategoryChips({ categories, selected, onSelect, label }: FriendsCategoryChipsProps) {
  const options = categories.map((category) => ({
    value: category,
    label: (
      <>
        <span className="size-3.5 shrink-0">
          <CubeCategoryIcon category={category} />
        </span>
        <span className="font-mono">{category}</span>
      </>
    )
  }))

  return <ChipGroup value={selected} onChange={onSelect} options={options} label={label} />
}
