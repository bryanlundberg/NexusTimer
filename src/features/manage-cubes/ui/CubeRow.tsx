import { ArrowDown, ArrowUp, Star } from 'lucide-react'
import { PlayIcon } from '@radix-ui/react-icons'
import { useLocale, useTranslations } from 'next-intl'
import dayjs from '@/shared/lib/dayjs'
import type { Cube } from '@/entities/cube/model/types'
import { CubeColorDot } from '@/shared/ui/category-badge/CubeColorDot'
import { CubeCategoryIcon } from '@/shared/ui/cube-category-icon/CubeCategoryIcon'
import { CubeRecentSpark } from '@/features/manage-cubes/ui/CubeRecentSpark'
import formatTime from '@/shared/lib/formatTime'
import { cn } from '@/shared/lib/utils'
import { useCubeActions } from '@/features/manage-cubes/model/useCubeActions'
import { type CurrentAverage, useCubeSolveSummary } from '@/features/manage-cubes/model/useCubeSolveSummary'
import { CubeRowStat } from '@/features/manage-cubes/ui/CubeRowStat'
import { CubeRowMenu } from '@/features/manage-cubes/ui/CubeRowMenu'
import { CUBE_ROW_GRID, HIDE_ON_ENGAGE, SHOW_ON_ENGAGE } from '@/features/manage-cubes/ui/cubeRowGrid'

const META_LABEL = 'font-display text-[10px] uppercase tracking-wider text-muted-foreground/70'

function formatAverage({ value, isDnf }: CurrentAverage) {
  if (isDnf) return 'DNF'
  return value === null ? '--' : formatTime(value)
}

export function CubeRow({ cube }: { cube: Cube }) {
  const t = useTranslations('Index')
  const { handleRedirect } = useCubeActions(cube)
  const locale = useLocale()
  const { uniqueSolves, recentSolves, bestTime, ao5, ao12, ao12Delta, lastSolveAt } = useCubeSolveSummary(cube)

  const sessionCount = cube.solves.session.length
  const isActive = sessionCount > 0

  return (
    <div
      className={cn(
        `group relative grid ${CUBE_ROW_GRID} items-center gap-x-4 px-3 py-3 transition-colors duration-150`,
        'hover:bg-foreground/[0.04]',
        'has-[[data-cube-nav]:focus-visible]:bg-foreground/10 has-[[data-cube-nav]:focus-visible]:shadow-[inset_3px_0_0_var(--foreground)]'
      )}
    >
      <div aria-hidden className="relative grid size-7 place-items-center">
        <CubeCategoryIcon
          category={cube.category}
          className="size-6 text-muted-foreground pointer-fine:group-hover:invisible pointer-fine:group-has-[[data-cube-nav]:focus-visible]:invisible"
        />
        <PlayIcon className="invisible absolute size-5 text-primary pointer-fine:group-hover:visible pointer-fine:group-has-[[data-cube-nav]:focus-visible]:visible" />
      </div>

      <div className="flex min-w-0 flex-col gap-0.5">
        <div className="flex min-w-0 items-center gap-2">
          <button
            type="button"
            data-cube-nav
            onClick={handleRedirect}
            data-testid={`cube-name-${cube.name}`}
            className="min-w-0 cursor-pointer truncate text-left text-sm font-semibold outline-none transition-colors group-hover:text-primary after:absolute after:inset-0"
          >
            {cube.name}
          </button>
          {cube.favorite && <Star aria-hidden className="size-3 shrink-0 fill-record text-record" />}
        </div>
        <div className="flex min-w-0 items-center gap-1.5 truncate text-xs text-muted-foreground tabular-nums">
          <CubeColorDot category={cube.category} />
          <span className="font-mono">{cube.category}</span>
          {isActive && sessionCount !== uniqueSolves && (
            <span className="whitespace-nowrap">
              · {sessionCount} <span className={META_LABEL}>{t('SolvesRail.session')}</span>
            </span>
          )}
          <span className="whitespace-nowrap">
            · {uniqueSolves} <span className={META_LABEL}>{t('CubesPage.total')}</span>
          </span>
        </div>
      </div>

      <CubeRowStat label={t('CubesPage.last-used')} className="hidden @3xl:flex">
        <span className="truncate text-xs text-muted-foreground">
          {lastSolveAt === null ? '--' : dayjs(lastSolveAt).locale(locale).fromNow()}
        </span>
      </CubeRowStat>

      <CubeRowStat label="Ao5" className="hidden @xl:flex">
        <span className="font-mono text-sm tabular-nums">{formatAverage(ao5)}</span>
      </CubeRowStat>

      <CubeRowStat label="Ao12" className="hidden @2xl:flex">
        {ao12Delta !== null && Math.abs(ao12Delta) >= 10 && (
          <span
            className={cn(
              'inline-flex items-center text-[10px] tabular-nums',
              ao12Delta < 0 ? 'text-success' : 'text-muted-foreground'
            )}
          >
            {ao12Delta < 0 ? <ArrowDown className="size-3" /> : <ArrowUp className="size-3" />}
            {formatTime(Math.abs(ao12Delta))}s
          </span>
        )}
        <span className="font-mono text-sm tabular-nums">{formatAverage(ao12)}</span>
      </CubeRowStat>

      <div className="hidden justify-end @md:flex">
        <CubeRecentSpark solves={recentSolves} bestTime={bestTime} />
      </div>

      <div className="flex min-w-20 items-center justify-end gap-1 justify-self-end">
        <div className={cn('flex flex-col items-end gap-0.5', HIDE_ON_ENGAGE)}>
          <span className={META_LABEL}>{t('HomePage.best')}</span>
          <span
            className={cn(
              'font-mono text-base tabular-nums leading-none',
              bestTime === null ? 'text-muted-foreground' : 'text-foreground'
            )}
          >
            {bestTime === null ? '--' : formatTime(bestTime)}
          </span>
        </div>
        <CubeRowMenu cube={cube} className={cn(SHOW_ON_ENGAGE, 'pointer-coarse:-mr-3')} />
      </div>
    </div>
  )
}
