import type { CSSProperties } from 'react'
import { Check } from 'lucide-react'
import { cubeCollection } from '@/shared/const/cube-collection'
import { CubeCategory } from '@/shared/const/cube-categories'
import { CubeCategoryIcon } from '@/shared/ui/cube-category-icon/CubeCategoryIcon'
import { cn } from '@/shared/lib/utils'

const SELECTED_STYLE = {
  '--surface-border-color': 'color-mix(in oklab, var(--foreground) 40%, var(--border))',
  '--surface-fill': 'var(--muted)'
} as CSSProperties

interface CubeCategoryGridProps {
  value: CubeCategory
  onChange: (value: CubeCategory) => void
  testIdPrefix?: string
}

export default function CubeCategoryGrid({ value, onChange, testIdPrefix = 'category' }: CubeCategoryGridProps) {
  return (
    <div className="grid grid-cols-4 gap-1.5 sm:grid-cols-3 sm:gap-2">
      {cubeCollection.map((cube) => {
        const selected = value === cube.name
        return (
          <button
            type="button"
            key={cube.name}
            data-testid={`${testIdPrefix}-${cube.name}`}
            aria-pressed={selected}
            onClick={() => onChange(cube.name)}
            style={selected ? SELECTED_STYLE : undefined}
            className="surface surface-sm group flex min-w-0 cursor-pointer flex-col items-center gap-1.5 px-1.5 pt-2.5 pb-2 focus-visible:outline-none sm:flex-row sm:gap-2.5 sm:px-3 sm:py-2.5 sm:text-left"
          >
            <span
              className={cn(
                'size-8 shrink-0 transition-colors duration-150 sm:size-7',
                selected ? 'text-foreground' : 'text-muted-foreground group-hover:text-foreground'
              )}
            >
              <CubeCategoryIcon category={cube.name} />
            </span>
            <span
              className={cn(
                'w-full min-w-0 truncate text-center text-[11px] leading-tight sm:w-auto sm:flex-1 sm:text-left sm:text-sm',
                selected ? 'font-medium text-foreground' : 'text-muted-foreground group-hover:text-foreground'
              )}
            >
              {cube.name}
            </span>
            {selected && <Check aria-hidden className="hidden size-4 shrink-0 text-primary sm:block" />}
          </button>
        )
      })}
    </div>
  )
}
