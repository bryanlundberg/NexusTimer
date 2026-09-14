import { IconButton } from '@/components/ui/shadcn-io/icon-button'
import { Clock, Star } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { CategoryBadge } from '@/shared/ui/category-badge/CategoryBadge'
import { PlayIcon } from '@radix-ui/react-icons'
import GearIcon from '@/components/ui/gear-icon'
import TrashIcon from '@/components/ui/trash-icon'
import PlayerIcon from '@/components/ui/player-icon'
import dayjs from '@/shared/lib/dayjs'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { Button } from '@/components/ui/button'
import { Cube } from '@/entities/cube/model/types'
import { useMemo, useRef } from 'react'
import { Solve } from '@/entities/solve/model/types'
import formatTime from '@/shared/lib/formatTime'
import SolvesTrend from '@/shared/ui/solves-trend/SolvesTrend'
import type { AnimatedIconHandle } from '@/components/ui/types'
import { useLocale, useTranslations } from 'next-intl'
import { useCubeActions } from '@/features/manage-cubes/model/useCubeActions'
import { CubeCategoryIcon } from '@/shared/ui/cube-category-icon/CubeCategoryIcon'
import { cn } from '@/shared/lib/utils'

interface CubeCardProps {
  cube: Cube
}

export function CubeCard({ cube }: CubeCardProps) {
  const t = useTranslations('Index')
  const locale = useLocale()
  const { handleEdit, handleDelete, handleRedirect, handleFavorite } = useCubeActions(cube)
  const gearRef = useRef<AnimatedIconHandle>(null)
  const trashRef = useRef<AnimatedIconHandle>(null)
  const playRef = useRef<AnimatedIconHandle>(null)

  const { uniqueSolves, recentSolves, bestTime } = useMemo(() => {
    const byId = new Map<string, Solve>()
    cube.solves.all.forEach((solve) => byId.set(solve.id, solve))
    cube.solves.session.forEach((solve) => byId.set(solve.id, solve))
    const live = [...byId.values()].filter((solve) => !solve.isDeleted)
    const best = live.reduce<number | null>(
      (min, solve) => (!solve.dnf && (min === null || solve.time < min) ? solve.time : min),
      null
    )
    return {
      uniqueSolves: byId.size,
      recentSolves: live.sort((a, b) => b.endTime - a.endTime).slice(0, 40),
      bestTime: best
    }
  }, [cube])

  const isActive = cube.solves.session.length > 0

  const stats = [
    { label: t('SolvesRail.session'), value: String(cube.solves.session.length) },
    { label: t('CubesPage.total'), value: String(uniqueSolves) },
    { label: t('HomePage.best'), value: bestTime === null ? '--' : formatTime(bestTime), isRecord: bestTime !== null }
  ]

  return (
    <div
      key={cube.id}
      data-active={isActive ? 'true' : undefined}
      data-favorite={cube.favorite ? 'true' : undefined}
      className={cn('cube-notch group relative flex flex-col gap-2 p-4 text-card-foreground')}
    >
      {cube.favorite && (
        <span
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-amber-400/0 via-amber-400 to-amber-400/0"
        />
      )}

      {/* Header */}
      <div className="flex justify-between items-start">
        <div className="flex items-center gap-2 min-w-0 flex-1">
          <h3
            className="text-base font-semibold cursor-pointer hover:text-primary break-words transition-colors"
            onClick={handleRedirect}
            data-testid={`cube-name-${cube.name}`}
          >
            {cube.name}
          </h3>
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

      <div className="flex items-center gap-2">
        <CategoryBadge category={cube.category} />
        {isActive ? (
          <Badge variant="secondary" className="text-xs gap-1">
            <PlayIcon className="h-3 w-3" />
            {t('CubesPage.using')}
          </Badge>
        ) : (
          <span className="text-xs text-muted-foreground">{t('CubesPage.idle')}</span>
        )}
        <span
          className="ml-auto flex shrink-0 items-center gap-1 text-xs text-muted-foreground"
          title={t('CubesPage.created')}
        >
          <Clock className="size-3" />
          {dayjs(cube.createdAt).locale(locale).format('L')}
        </span>
      </div>

      <div className="grid grid-cols-3 gap-1.5">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className={cn(
              'chip-notch chip-notch-sm flex min-w-0 flex-col gap-0.5 px-2 py-1.5',
              stat.isRecord ? 'bg-amber-500/10' : 'bg-foreground/[0.04]'
            )}
          >
            <span className="truncate font-display text-[9px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
              {stat.label}
            </span>
            <span
              className={cn(
                'truncate text-sm font-semibold tabular-nums leading-tight',
                stat.isRecord ? 'text-amber-700 dark:text-amber-400' : 'text-foreground'
              )}
            >
              {stat.value}
            </span>
          </div>
        ))}
      </div>

      <SolvesTrend solves={recentSolves} bestTime={bestTime} className="mt-0 h-8" />

      {/* Footer */}
      <div className="mt-auto flex w-full items-center justify-between gap-2 text-sm pt-1">
        <Button
          variant={'default'}
          size={'sm'}
          onClick={handleRedirect}
          onMouseEnter={() => playRef.current?.startAnimation()}
          onMouseLeave={() => playRef.current?.stopAnimation()}
          data-testid={`utilize-cube-button-${cube.name}`}
        >
          <PlayerIcon ref={playRef} size={14} className="mr-1" />
          {t('CubesPage.utilize')}
        </Button>
        <div className="flex items-center gap-1">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant={'ghost'}
                  size={'icon'}
                  className="h-8 w-8"
                  onClick={handleEdit}
                  onMouseEnter={() => gearRef.current?.startAnimation()}
                  onMouseLeave={() => gearRef.current?.stopAnimation()}
                  data-testid={`edit-cube-button-${cube.name}`}
                >
                  <GearIcon ref={gearRef} size={16} />
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
                  onMouseEnter={() => trashRef.current?.startAnimation()}
                  onMouseLeave={() => trashRef.current?.stopAnimation()}
                  data-testid={`delete-cube-button-${cube.name}`}
                >
                  <TrashIcon ref={trashRef} size={16} />
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

      <div
        aria-hidden
        className="pointer-events-none select-none absolute -bottom-2 -right-2 -z-[1] size-[140px] rotate-12 text-foreground opacity-[0.04] dark:opacity-[0.02]"
      >
        <CubeCategoryIcon category={cube.category} />
      </div>
    </div>
  )
}
