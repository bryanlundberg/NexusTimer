'use client'

import { useMemo } from 'react'
import { useTranslations } from 'next-intl'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { Trash2, Plus, X, Check, MoreVertical } from 'lucide-react'
import AlgorithmRender from '@/shared/ui/twisty/AlgorithmRender'
import type { TrainerSolveListItem } from '@/features/trainer/model/types'
import type { TrainerPenalty } from '@/entities/trainer-solve/model/constants'
import type { AlgorithmCollection } from '@/features/algorithms-list/model/types'
import { cn } from '@/shared/lib/utils'
import { buildVizConfig, formatTime, formatRelative, penaltyDotClass } from '@/features/trainer/lib/trainerUtils'

interface TrainerSolveHistoryTableProps {
  solves: TrainerSolveListItem[]
  isLoading?: boolean
  isLoadingMore?: boolean
  reachedEnd?: boolean
  onLoadMore?: () => void
  onChangePenalty: (id: string, penalty: TrainerPenalty) => void
  onDelete: (id: string) => void
  showCase?: boolean
  caseById?: Map<string, AlgorithmCollection>
  puzzle?: string
  vizDefaults?: Record<string, unknown>
  emptyLabel?: string
}

const GRID_WITH_CASE = 'grid-cols-[28px_64px_1fr_56px_28px]'
const GRID_NO_CASE = 'grid-cols-[1fr_56px_28px]'

export default function TrainerSolveHistoryTable({
  solves,
  isLoading,
  isLoadingMore,
  reachedEnd,
  onLoadMore,
  onChangePenalty,
  onDelete,
  showCase = false,
  caseById,
  puzzle,
  vizDefaults,
  emptyLabel
}: TrainerSolveHistoryTableProps) {
  const t = useTranslations('Index.TrainerHistoryPage.table')
  const vizConfigByCaseId = useMemo(() => {
    if (!showCase || !caseById || !puzzle) return new Map()
    const map = new Map()
    caseById.forEach((algCase, id) => {
      map.set(id, buildVizConfig(puzzle, algCase?.algs?.[0]?.moves ?? '', vizDefaults))
    })
    return map
  }, [showCase, caseById, puzzle, vizDefaults])

  if (solves.length === 0) {
    return (
      <div className="rounded-lg border bg-card/40 px-3 py-6">
        <p className="text-xs text-muted-foreground text-center">
          {isLoading ? t('loading') : (emptyLabel ?? t('empty'))}
        </p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="overflow-hidden rounded-lg border bg-card/40">
        <div
          className={cn(
            'grid items-center gap-2 px-2.5 py-1.5 text-[10px] uppercase tracking-wider text-muted-foreground bg-muted/40 border-b',
            showCase ? GRID_WITH_CASE : GRID_NO_CASE
          )}
        >
          {showCase && <span />}
          <span>{t('time')}</span>
          {showCase && <span>{t('case')}</span>}
          <span className="text-right">{t('ago')}</span>
          <span />
        </div>

        <ul className="flex flex-col divide-y">
          {solves.map((solve) => {
            const algCase = showCase ? caseById?.get(solve.caseId) : undefined
            const vizConfig = showCase ? vizConfigByCaseId.get(solve.caseId) : undefined
            return (
              <li
                key={solve._id}
                className={cn(
                  'grid items-center gap-2 px-2.5 h-9 text-xs transition-colors hover:bg-muted/40',
                  showCase ? GRID_WITH_CASE : GRID_NO_CASE
                )}
              >
                {showCase && (
                  <div className="size-6 rounded-sm overflow-hidden bg-muted/30 flex items-center justify-center">
                    {vizConfig ? <AlgorithmRender config={vizConfig} width={24} height={24} /> : null}
                  </div>
                )}

                <span className="flex items-center gap-1.5 font-mono tabular-nums">
                  <span className={cn('size-1.5 rounded-full shrink-0', penaltyDotClass(solve.penalty))} />
                  <span
                    className={cn(
                      solve.penalty === 'DNF' && 'text-muted-foreground line-through',
                      solve.penalty === '+2' && 'text-amber-600 dark:text-amber-400'
                    )}
                  >
                    {formatTime(solve.timeMs, solve.penalty)}
                  </span>
                </span>

                {showCase && <span className="truncate text-muted-foreground">{algCase?.name ?? solve.caseId}</span>}

                <span className="text-right text-muted-foreground tabular-nums">{formatRelative(solve.createdAt)}</span>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-6 w-6 shrink-0" aria-label={t('solveActions')}>
                      <MoreVertical className="h-3.5 w-3.5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-40">
                    <DropdownMenuItem
                      onClick={() => onChangePenalty(solve._id, 'OK')}
                      disabled={solve.penalty === 'OK'}
                    >
                      <Check className="h-3.5 w-3.5" />
                      OK
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => onChangePenalty(solve._id, '+2')}
                      disabled={solve.penalty === '+2'}
                    >
                      <Plus className="h-3.5 w-3.5" />
                      +2
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => onChangePenalty(solve._id, 'DNF')}
                      disabled={solve.penalty === 'DNF'}
                    >
                      <X className="h-3.5 w-3.5" />
                      DNF
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem variant="destructive" onClick={() => onDelete(solve._id)}>
                      <Trash2 className="h-3.5 w-3.5" />
                      {t('delete')}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </li>
            )
          })}
        </ul>
      </div>

      {!reachedEnd && (
        <Button variant="outline" size="sm" className="w-full h-8" onClick={onLoadMore} disabled={isLoadingMore}>
          {isLoadingMore ? t('loading') : t('loadMore')}
        </Button>
      )}
    </div>
  )
}
