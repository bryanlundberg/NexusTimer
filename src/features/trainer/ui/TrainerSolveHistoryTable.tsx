'use client'

import { useMemo } from 'react'
import { useTranslations } from 'next-intl'
import { motion } from 'motion/react'
import { Button } from '@/components/ui/button'
import { Trash2 } from 'lucide-react'
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
  onDelete: (id: string) => void
  showCase?: boolean
  caseById?: Map<string, AlgorithmCollection>
  puzzle?: string
  vizDefaults?: Record<string, unknown>
  emptyLabel?: string
  targetMs?: number
}

const GRID_WITH_CASE = 'grid-cols-[28px_1fr_7rem_6rem_28px]'
const GRID_NO_CASE = 'grid-cols-[1fr_6rem_28px]'

function TimeCell({ timeMs, penalty, targetMs }: { timeMs: number; penalty: TrainerPenalty; targetMs?: number }) {
  const formatted = formatTime(timeMs, penalty)
  const [main, decimal] = formatted.includes('.') ? formatted.split('.') : [formatted, null]
  return (
    <div className="flex items-center gap-1.5">
      <span className={cn('size-1.5 rounded-full shrink-0', penaltyDotClass(penalty, timeMs, targetMs))} />
      <div
        className={cn(
          'flex items-baseline gap-0.5 tabular-nums',
          penalty === 'DNF' && 'text-muted-foreground line-through',
          penalty === '+2' && 'text-amber-600 dark:text-amber-400'
        )}
      >
        <span className="text-sm font-semibold">{main}</span>
        {decimal && <span className="text-xs text-muted-foreground">.{decimal}</span>}
      </div>
    </div>
  )
}

export default function TrainerSolveHistoryTable({
  solves,
  isLoading,
  isLoadingMore,
  reachedEnd,
  onLoadMore,
  onDelete,
  showCase = false,
  caseById,
  puzzle,
  vizDefaults,
  emptyLabel,
  targetMs
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
      <div className="px-3 py-8 text-center">
        <p className="text-xs text-muted-foreground">{isLoading ? t('loading') : (emptyLabel ?? t('empty'))}</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-2">
      <div>
        <div
          className={cn(
            'grid items-center gap-x-4 px-3 py-2 border-b border-border/60',
            showCase ? GRID_WITH_CASE : GRID_NO_CASE
          )}
        >
          {showCase && <span />}
          <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">{t('time')}</span>
          {showCase && (
            <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
              {t('case')}
            </span>
          )}
          <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">{t('ago')}</span>
          <span />
        </div>

        <motion.div
          initial="hidden"
          animate="show"
          variants={{ hidden: {}, show: { transition: { staggerChildren: 0.03 } } }}
        >
          {solves.map((solve) => {
            const algCase = showCase ? caseById?.get(solve.caseId) : undefined
            const vizConfig = showCase ? vizConfigByCaseId.get(solve.caseId) : undefined
            return (
              <motion.div
                key={solve._id}
                variants={{ hidden: { opacity: 0 }, show: { opacity: 1 } }}
                transition={{ duration: 0.2, ease: 'easeOut' }}
                className={cn(
                  'grid items-center gap-x-4 px-3 py-2.5 border-b border-border/40 last:border-b-0',
                  'border-l-2 border-l-transparent transition-colors duration-150 hover:bg-muted/20 hover:border-l-primary',
                  showCase ? GRID_WITH_CASE : GRID_NO_CASE
                )}
              >
                {showCase && (
                  <div className="size-6 rounded-sm overflow-hidden bg-muted/30 flex items-center justify-center">
                    {vizConfig ? <AlgorithmRender config={vizConfig} width={24} height={24} /> : null}
                  </div>
                )}

                <TimeCell timeMs={solve.timeMs} penalty={solve.penalty} targetMs={targetMs} />

                {showCase && (
                  <span className="truncate text-xs text-muted-foreground">{algCase?.name ?? solve.caseId}</span>
                )}

                <span className="text-xs text-muted-foreground tabular-nums">{formatRelative(solve.createdAt)}</span>

                <Button
                  variant="ghost"
                  size="icon"
                  haptic
                  className="h-6 w-6 shrink-0 text-muted-foreground hover:text-destructive"
                  aria-label={t('delete')}
                  title={t('delete')}
                  onClick={() => onDelete(solve._id)}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </motion.div>
            )
          })}
        </motion.div>
      </div>

      {!reachedEnd && (
        <Button variant="outline" size="sm" className="w-full h-8" onClick={onLoadMore} disabled={isLoadingMore}>
          {isLoadingMore ? t('loading') : t('loadMore')}
        </Button>
      )}
    </div>
  )
}
