import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { IconButton } from '@/components/ui/shadcn-io/icon-button'
import { Star, Clock, Hash } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { GearIcon, PlayIcon, TrashIcon } from '@radix-ui/react-icons'
import { DateTime } from 'luxon'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { Button } from '@/components/ui/button'
import { Cube } from '@/entities/cube/model/types'
import { useLocale, useTranslations } from 'next-intl'
import { useCubeActions } from '@/features/manage-cubes/model/useCubeActions'
import { cubeCollection } from '@/shared/const/cube-collection'
import Image from 'next/image'
import { useTheme } from 'next-themes'
import { cn } from '@/shared/lib/utils'

interface CubeCardProps {
  cube: Cube
}

export function CubeCard({ cube }: CubeCardProps) {
  const t = useTranslations('Index')
  const locale = useLocale()
  const { resolvedTheme } = useTheme()
  const { handleEdit, handleDelete, handleRedirect, handleFavorite } = useCubeActions(cube)
  const src = cubeCollection.find((c) => c.name === cube.category)?.src

  const uniqueSolves = (() => {
    const uniqueIds = new Set<string>()
    cube.solves.all.forEach((solve) => uniqueIds.add(solve.id))
    cube.solves.session.forEach((solve) => uniqueIds.add(solve.id))
    return uniqueIds.size
  })()

  const isActive = cube.solves.session.length > 0

  return (
    <Card
      key={cube.id}
      className={cn(
        'relative overflow-hidden gap-2 bg-card/50 transition-colors duration-200 hover:bg-card/80 hover:border-primary/20',
        isActive && 'border-primary/15'
      )}
    >
      <CardHeader className="pb-0">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-2 min-w-0 flex-1">
            <CardTitle
              className="text-base font-semibold cursor-pointer hover:text-primary truncate transition-colors"
              onClick={handleRedirect}
              data-testid={`cube-name-${cube.name}`}
            >
              {cube.name}
            </CardTitle>
            {isActive && (
              <span className="relative flex h-2 w-2 shrink-0">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
              </span>
            )}
          </div>
          <IconButton
            data-testid={`favorite-cube-button-${cube.name}`}
            icon={Star}
            active={cube.favorite}
            color={[251, 191, 36]}
            onClick={handleFavorite}
            size="sm"
          />
        </div>
        <div className="flex items-center gap-2 mt-1">
          <Badge variant="outline" className="text-xs">
            {cube.category}
          </Badge>
          {isActive ? (
            <Badge variant="secondary" className="text-xs gap-1">
              <PlayIcon className="h-3 w-3" />
              {t('CubesPage.using')}
            </Badge>
          ) : (
            <span className="text-xs text-muted-foreground">{t('CubesPage.idle')}</span>
          )}
        </div>
      </CardHeader>

      <CardContent className="pb-0">
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5" />
            <span>{DateTime.fromMillis(cube.createdAt).setLocale(locale).toLocaleString()}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Hash className="h-3.5 w-3.5" />
            <span>
              {cube.solves.session.length}/{cube.solves.all.length}
              <span className="text-muted-foreground/70"> ({uniqueSolves})</span>
            </span>
          </div>
        </div>
      </CardContent>

      <CardFooter className="pt-1">
        <div className="flex w-full items-center justify-between gap-2 text-sm">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant={'default'}
                  size={'sm'}
                  onClick={handleRedirect}
                  data-testid={`utilize-cube-button-${cube.name}`}
                >
                  <PlayIcon className="mr-1 h-4 w-4" />
                  {t('CubesPage.utilize')}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{t('CubesPage.utilize-cube', { name: cube.name })}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <div className="flex items-center gap-1">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant={'ghost'}
                    size={'icon'}
                    className="h-8 w-8"
                    onClick={handleEdit}
                    data-testid={`edit-cube-button-${cube.name}`}
                  >
                    <GearIcon className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>
                    {t('CubesPage.edit')} {cube.name}
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant={'ghost'}
                    size={'icon'}
                    className="h-8 w-8 text-muted-foreground hover:text-destructive"
                    onClick={handleDelete}
                    data-testid={`delete-cube-button-${cube.name}`}
                  >
                    <TrashIcon className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>
                    {t('CubesPage.delete')} {cube.name}
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
      </CardFooter>

      <div
        className={cn(
          'pointer-events-none select-none absolute -bottom-2 -right-2 text-foreground/10 rotate-12',
          resolvedTheme === 'dark' ? 'opacity-5' : 'opacity-10'
        )}
      >
        <Image src={src} alt={`${cube.category} icon`} width={140} height={140} unoptimized />
      </div>
    </Card>
  )
}
