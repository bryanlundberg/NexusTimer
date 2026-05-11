'use client'

import { useMemo } from 'react'
import _ from 'lodash'
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
import type { TrainerSolveListItem } from '@/features/trainer/model/useTrainerSolves'
import type { TrainerPenalty } from '@/entities/trainer-solve/model/constants'
import type { AlgorithmCollection } from '@/features/algorithms-list/model/types'
import { TwistyPlayer } from 'cubing/twisty'
import { cn } from '@/shared/lib/utils'

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

const formatTime = (ms: number, penalty: TrainerPenalty) => {
  if (penalty === 'DNF') return 'DNF'
  const base = (ms / 1000).toFixed(2)
  return penalty === '+2' ? `${base}+` : base
}

const formatRelative = (iso: string) => {
  const date = new Date(iso)
  const diff = Date.now() - date.getTime()
  const sec = Math.floor(diff / 1000)
  if (sec < 60) return `${sec}s`
  const min = Math.floor(sec / 60)
  if (min < 60) return `${min}m`
  const hr = Math.floor(min / 60)
  if (hr < 24) return `${hr}h`
  const days = Math.floor(hr / 24)
  if (days < 7) return `${days}d`
  return date.toLocaleDateString()
}

const penaltyDotClass = (penalty: TrainerPenalty) =>
  penalty === 'DNF' ? 'bg-red-500/70' : penalty === '+2' ? 'bg-amber-500/70' : 'bg-emerald-500/70'

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
  const vizConfigByCaseId = useMemo(() => {
    if (!showCase || !caseById || !puzzle) return new Map<string, Partial<TwistyPlayer>>()
    const map = new Map<string, Partial<TwistyPlayer>>()
    caseById.forEach((algCase, id) => {
      const moves = algCase?.algs?.[0]?.moves ?? ''
      const cfg = _.merge(
        {
          visualization: 'experimental-2D-LL',
          background: 'none',
          controlPanel: 'none',
          experimentalStickering: 'OLL',
          experimentalSetupAnchor: 'end',
          experimentalDragInput: 'none'
        },
        vizDefaults ?? {},
        { puzzle, alg: moves }
      ) as unknown as Partial<TwistyPlayer>
      map.set(id, cfg)
    })
    return map
  }, [showCase, caseById, puzzle, vizDefaults])

  if (solves.length === 0) {
    return (
      <div className="rounded-lg border bg-card/40 px-3 py-6">
        <p className="text-xs text-muted-foreground text-center">
          {isLoading ? 'Loading…' : (emptyLabel ?? 'No solves yet.')}
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
          <span>Time</span>
          {showCase && <span>Case</span>}
          <span className="text-right">Ago</span>
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
                    <Button variant="ghost" size="icon" className="h-6 w-6 shrink-0" aria-label="Solve actions">
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
                      Delete
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
          {isLoadingMore ? 'Loading…' : 'Load more'}
        </Button>
      )}
    </div>
  )
}
