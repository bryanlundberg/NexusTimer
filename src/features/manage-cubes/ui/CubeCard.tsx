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

interface CubeCardProps {
  cube: Cube
}

export function CubeCard({ cube }: CubeCardProps) {
  const t = useTranslations('Index')
  const locale = useLocale()
  const { handleEdit, handleDelete, handleRedirect, handleFavorite } = useCubeActions(cube)

  return (
    <Card key={cube.id} className="overflow-hidden gap-1">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg cursor-pointer hover:text-primary truncate" onClick={handleRedirect}>
            {cube.name}
          </CardTitle>
          <IconButton
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
                <Button variant={'default'} size={'sm'} onClick={handleRedirect}>
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
                  <Button variant={'ghost'} size={'sm'} onClick={handleEdit} data-testid="edit-cube-button">
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
                  <Button variant={'ghost'} size={'sm'} onClick={handleDelete} data-testid="delete-cube-button">
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
    </Card>
  )
}
