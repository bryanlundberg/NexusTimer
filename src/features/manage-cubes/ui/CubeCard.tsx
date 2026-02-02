import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { IconButton } from '@/components/ui/shadcn-io/icon-button'
import { Star } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { GearIcon, PlayIcon, StopIcon, TrashIcon } from '@radix-ui/react-icons'
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
  return (
    <Card key={cube.id} className="relative overflow-hidden gap-1 bg-card/50">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle
            className="text-lg cursor-pointer hover:text-primary truncate"
            onClick={handleRedirect}
            data-testid={`cube-name-${cube.name}`}
          >
            {cube.name}
          </CardTitle>
          <IconButton
            data-testid={`favorite-cube-button-${cube.name}`}
            icon={Star}
            active={cube.favorite}
            color={[251, 191, 36]} // amber-400
            onClick={handleFavorite}
            size="sm"
          />
        </div>
        <CardDescription className="flex items-center gap-2">
          <Badge variant="outline">{cube.category}</Badge>
          {cube.solves.session.length > 0 ? (
            <div className="flex items-center gap-1 text-xs">
              <PlayIcon className="h-3 w-3" />
              {t('CubesPage.using')}
            </div>
          ) : (
            <div className="flex items-center gap-1 text-xs">
              <StopIcon className="h-3 w-3" />
              {t('CubesPage.idle')}
            </div>
          )}
        </CardDescription>
      </CardHeader>

      <CardContent className="pb-2">
        <div className="text-sm mb-1">
          <span className="text-muted-foreground">{t('CubesPage.created')}: </span>
          {DateTime.fromMillis(cube.createdAt).setLocale(locale).toLocaleString()}
        </div>
        <div className="text-sm mb-3">
          <span className="text-muted-foreground">{t('CubesPage.solves-label')}: </span>
          {cube.solves.session.length}/{cube.solves.all.length} (
          {(() => {
            const uniqueSolveIds = new Set<string>()
            cube.solves.all.forEach((solve) => uniqueSolveIds.add(solve.id))
            cube.solves.session.forEach((solve) => uniqueSolveIds.add(solve.id))
            return uniqueSolveIds.size
          })()}{' '}
          {t('CubesPage.total')})
        </div>
      </CardContent>

      <CardFooter className="pt-2">
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

          <div className="flex items-center gap-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant={'ghost'}
                    size={'sm'}
                    onClick={handleEdit}
                    data-testid={`edit-cube-button-${cube.name}`}
                  >
                    <GearIcon className="mr-1 h-4 w-4" />
                    {t('CubesPage.edit')}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>
                    {t('CubesPage.edit')} `{cube.name}`
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant={'ghost'}
                    size={'sm'}
                    onClick={handleDelete}
                    data-testid={`delete-cube-button-${cube.name}`}
                  >
                    <TrashIcon className="mr-1 h-4 w-4" />
                    {t('CubesPage.delete')}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>
                    {t('CubesPage.delete')} `{cube.name}`
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
      </CardFooter>
      <div
        className={cn(
          'pointer-events-none select-none absolute bottom-5 right-10 text-foreground/10 rotate-25',
          resolvedTheme === 'dark' ? 'opacity-5' : 'opacity-15'
        )}
      >
        <Image src={src} alt={`${cube.category} icon`} width={200} height={200} unoptimized />
      </div>
    </Card>
  )
}
