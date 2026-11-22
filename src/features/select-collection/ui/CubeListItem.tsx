import { Cube } from '@/entities/cube/model/types'
import { cubeCollection } from '@/shared/const/cube-collection'
import { cn } from '@/shared/lib/utils'
import getBestTime from '@/shared/lib/statistics/getBestTime'
import formatTime from '@/shared/lib/formatTime'
import { CubeCategoryIcon } from '@/shared/ui/cube-category-icon/CubeCategoryIcon'
import { Check, Star } from 'lucide-react'
import { useEffect, useRef } from 'react'

export function CubeListItem({
  cube,
  onSelect,
  isSelected,
  isActive = false
}: {
  cube: Cube
  onSelect: (id: string) => void
  isSelected: boolean
  isActive?: boolean
}) {
  const ref = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (isActive) ref.current?.scrollIntoView({ block: 'nearest' })
  }, [isActive])

  const foundCube = cubeCollection.find((i) => i.name === cube.category)

  const combined = [...(cube.solves?.session ?? []), ...(cube.solves?.all ?? [])]
  const seen = new Set<string>()
  const validSolves = combined.filter((s) => {
    if (s.isDeleted || s.dnf || seen.has(s.id)) return false
    seen.add(s.id)
    return true
  })
  const pb = validSolves.length > 0 ? formatTime(getBestTime({ solves: validSolves })) : null

  return (
    <button
      ref={ref}
      type="button"
      onClick={() => onSelect(cube.id)}
      data-selected={isSelected ? 'true' : undefined}
      data-active={isActive ? 'true' : undefined}
      className="menu-item relative flex w-full cursor-pointer items-center gap-3 px-3 py-2.5 text-left outline-none transition-colors hover:bg-accent/50 focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring/50 data-[active=true]:ring-2 data-[active=true]:ring-inset data-[active=true]:ring-ring/50 data-[selected=true]:bg-accent"
    >
      {foundCube ? (
        <span className={cn('size-[22px] shrink-0', isSelected ? 'text-foreground' : 'text-muted-foreground')}>
          <CubeCategoryIcon category={foundCube.name} />
        </span>
      ) : null}

      <div className="flex min-w-0 flex-1 flex-col">
        <p className={cn('truncate text-sm', isSelected && 'font-medium')}>{cube.name}</p>
        <p className="truncate text-xs text-muted-foreground">PB {pb ?? '--'}</p>
      </div>

      <div className="flex shrink-0 items-center gap-2">
        {cube.favorite && <Star className="size-3.5 fill-record text-record" />}
        {isSelected && <Check className="size-4 text-primary" />}
      </div>
    </button>
  )
}
