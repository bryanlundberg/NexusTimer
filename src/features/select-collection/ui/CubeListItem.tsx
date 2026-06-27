import { Cube } from '@/entities/cube/model/types'
import { cubeCollection } from '@/shared/const/cube-collection'
import { cn } from '@/shared/lib/utils'
import getBestTime from '@/shared/lib/statistics/getBestTime'
import formatTime from '@/shared/lib/formatTime'
import Image from 'next/image'
import { Check, Star } from 'lucide-react'
import { CSSProperties } from 'react'

const SELECTED_TEXTURE: CSSProperties = {
  backgroundImage: 'radial-gradient(color-mix(in oklab, var(--primary) 10%, transparent) 1px, transparent 1px)',
  backgroundSize: '13px 13px'
}

export function CubeListItem({
  cube,
  onSelect,
  isSelected
}: {
  cube: Cube
  onSelect: (id: string) => void
  isSelected: boolean
}) {
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
      type="button"
      onClick={() => onSelect(cube.id)}
      style={isSelected ? SELECTED_TEXTURE : undefined}
      className={cn(
        'relative flex w-full items-center gap-3 overflow-hidden rounded-lg px-3 py-2.5 text-left transition-colors',
        isSelected ? 'bg-primary/5' : 'hover:bg-muted'
      )}
    >
      {isSelected && <span className="absolute inset-y-1.5 left-0 w-1 rounded-r-full bg-primary" />}

      {foundCube ? (
        <Image
          unoptimized
          src={foundCube.src}
          alt={foundCube.name}
          width={22}
          height={22}
          className="shrink-0 object-scale-down opacity-90 dark:invert-0"
        />
      ) : null}

      <div className="flex min-w-0 flex-1 flex-col">
        <p className={cn('truncate text-sm', isSelected && 'font-medium')}>{cube.name}</p>
        <p className="truncate text-xs text-muted-foreground">PB {pb ?? '--'}</p>
      </div>

      <div className="flex shrink-0 items-center gap-2">
        {cube.favorite && <Star className="size-3.5 fill-yellow-500 text-yellow-500" />}
        {isSelected && (
          <span className="flex size-5 items-center justify-center rounded-full bg-primary text-primary-foreground">
            <Check className="size-3" strokeWidth={3} />
          </span>
        )}
      </div>
    </button>
  )
}
