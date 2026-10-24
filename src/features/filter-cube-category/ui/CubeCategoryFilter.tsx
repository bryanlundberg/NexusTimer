import { useMemo } from 'react'
import { useTranslations } from 'next-intl'
import { Check, ListFilter } from 'lucide-react'
import { Cube } from '@/entities/cube/model/types'
import { CUBE_CATEGORIES, CubeCategory } from '@/shared/const/cube-categories'
import { cubeColorClass } from '@/shared/const/cube-colors'
import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { cn } from '@/shared/lib/utils'

export type CubeCategoryFilterValue = CubeCategory | 'all'

interface CubeCategoryFilterProps {
  value: CubeCategoryFilterValue
  onChange: (value: CubeCategoryFilterValue) => void
  cubes: Cube[]
  open?: boolean
  onOpenChange?: (open: boolean) => void
  modal?: boolean
  align?: 'start' | 'end'
  className?: string
  contentClassName?: string
}

export default function CubeCategoryFilter({
  value,
  onChange,
  cubes,
  open,
  onOpenChange,
  modal,
  align = 'end',
  className,
  contentClassName
}: CubeCategoryFilterProps) {
  const t = useTranslations('Index')

  const disciplines = useMemo(() => {
    return CUBE_CATEGORIES.map((category) => ({
      category,
      count: cubes.filter((c) => c.category === category).length
    })).filter((d) => d.count > 0)
  }, [cubes])

  const label = value === 'all' ? t('SolvesPage.all') : value

  return (
    <DropdownMenu modal={modal} open={open} onOpenChange={onOpenChange}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className={cn('h-9 shrink-0 gap-1.5', className)}
          aria-label={t('CubesPage.category')}
        >
          {value === 'all' ? (
            <ListFilter className="size-4" />
          ) : (
            <span className={cn('size-2 shrink-0 rounded-full', cubeColorClass(value))} />
          )}
          <span className="max-w-24 truncate">{label}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align={align} className={cn('min-w-44', contentClassName)}>
        <DropdownMenuItem onClick={() => onChange('all')}>
          <span className="size-2 shrink-0 rounded-full bg-muted-foreground" />
          <span className="flex-1">{t('SolvesPage.all')}</span>
          <span className="text-xs text-muted-foreground">{cubes.length}</span>
          {value === 'all' && <Check className="size-3.5 text-primary" />}
        </DropdownMenuItem>
        {disciplines.map((d) => (
          <DropdownMenuItem key={d.category} onClick={() => onChange(d.category)}>
            <span className={cn('size-2 shrink-0 rounded-full', cubeColorClass(d.category))} />
            <span className="flex-1 truncate">{d.category}</span>
            <span className="text-xs text-muted-foreground">{d.count}</span>
            {value === d.category && <Check className="size-3.5 text-primary" />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
