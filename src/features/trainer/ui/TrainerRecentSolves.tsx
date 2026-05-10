'use client'

import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { History, Trash2, Plus, X, Check } from 'lucide-react'
import type { TrainerSolveListItem } from '@/features/trainer/model/useTrainerSolves'
import type { TrainerPenalty } from '@/entities/trainer-solve/model/constants'
import { cn } from '@/shared/lib/utils'

interface TrainerRecentSolvesProps {
  solves: TrainerSolveListItem[]
  isLoading?: boolean
  onChangePenalty: (id: string, penalty: TrainerPenalty) => void
  onDelete: (id: string) => void
}

const formatTime = (ms: number, penalty: TrainerPenalty) => {
  if (penalty === 'DNF') return 'DNF'
  const base = (ms / 1000).toFixed(2)
  return penalty === '+2' ? `${base}+` : base
}

export default function TrainerRecentSolves({
  solves,
  isLoading,
  onChangePenalty,
  onDelete
}: TrainerRecentSolvesProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center gap-1.5 text-muted-foreground">
        <History className="h-3 w-3" />
        <span className="text-[10px] font-semibold uppercase tracking-wider">Recent</span>
        <span className="text-[10px] ml-auto">{solves.length}</span>
      </div>

      {solves.length === 0 ? (
        <p className="text-xs text-muted-foreground py-1">{isLoading ? 'Loading…' : 'No solves yet for this case.'}</p>
      ) : (
        <div className="flex flex-wrap gap-1">
          {solves.map((solve) => (
            <DropdownMenu key={solve._id}>
              <DropdownMenuTrigger asChild>
                <button
                  type="button"
                  className={cn(
                    'h-7 px-2 rounded-md border bg-background hover:bg-accent transition-colors font-mono tabular-nums text-xs cursor-pointer',
                    solve.penalty === 'DNF' && 'text-muted-foreground line-through',
                    solve.penalty === '+2' && 'text-amber-600 dark:text-amber-400'
                  )}
                >
                  {formatTime(solve.timeMs, solve.penalty)}
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-40">
                <DropdownMenuItem onClick={() => onChangePenalty(solve._id, 'OK')} disabled={solve.penalty === 'OK'}>
                  <Check className="h-3.5 w-3.5" />
                  OK
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onChangePenalty(solve._id, '+2')} disabled={solve.penalty === '+2'}>
                  <Plus className="h-3.5 w-3.5" />
                  +2
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onChangePenalty(solve._id, 'DNF')} disabled={solve.penalty === 'DNF'}>
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
          ))}
        </div>
      )}
    </div>
  )
}
