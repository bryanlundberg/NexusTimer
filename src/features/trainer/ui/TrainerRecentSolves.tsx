'use client'

import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { History, MoreHorizontal, Trash2, Plus, X, Check } from 'lucide-react'
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
    <Card className="p-4 gap-3 bg-card/50">
      <div className="flex items-center gap-2">
        <History className="h-3.5 w-3.5 text-primary" />
        <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Last 12 solves</h3>
        <span className="text-xs text-muted-foreground ml-auto">{solves.length}</span>
      </div>

      {solves.length === 0 ? (
        <p className="text-xs text-muted-foreground py-2">{isLoading ? 'Loading…' : 'No solves yet for this case.'}</p>
      ) : (
        <div className="flex flex-wrap gap-1.5">
          {solves.map((solve) => (
            <DropdownMenu key={solve._id}>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className={cn(
                    'h-8 px-2.5 font-mono tabular-nums text-xs gap-1',
                    solve.penalty === 'DNF' && 'text-muted-foreground line-through',
                    solve.penalty === '+2' && 'text-amber-600 dark:text-amber-400'
                  )}
                >
                  {formatTime(solve.timeMs, solve.penalty)}
                  <MoreHorizontal className="h-3 w-3 opacity-50" />
                </Button>
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
    </Card>
  )
}
