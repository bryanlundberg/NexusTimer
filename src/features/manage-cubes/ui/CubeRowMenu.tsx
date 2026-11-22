import { MoreVertical, Settings, Star, Trash2 } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import type { Cube } from '@/entities/cube/model/types'
import { useCubeActions } from '@/features/manage-cubes/model/useCubeActions'
import { cn } from '@/shared/lib/utils'

export function CubeRowMenu({ cube, className }: { cube: Cube; className?: string }) {
  const t = useTranslations('Index')
  const { handleEdit, handleDelete, handleFavorite } = useCubeActions(cube)

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className={cn('relative z-10 size-8 text-muted-foreground pointer-coarse:size-10', className)}
          aria-label={`${t('tooltips.more-actions')} ${cube.name}`}
          data-testid={`cube-menu-button-${cube.name}`}
        >
          <MoreVertical className="size-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onSelect={handleFavorite} data-testid={`favorite-cube-button-${cube.name}`}>
          <Star className={cn(cube.favorite && 'fill-record text-record')} />
          {t('CubesPage.favorite')}
        </DropdownMenuItem>
        <DropdownMenuItem onSelect={handleEdit} data-testid={`edit-cube-button-${cube.name}`}>
          <Settings />
          {t('CubesPage.edit')}
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem variant="destructive" onSelect={handleDelete} data-testid={`delete-cube-button-${cube.name}`}>
          <Trash2 />
          {t('CubesPage.delete')}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
