'use client'

import { useMemo } from 'react'
import { useTranslations } from 'next-intl'
import { motion } from 'motion/react'
import { Button } from '@/components/ui/button'
import AlgorithmRender from '@/shared/ui/twisty/AlgorithmRender'
import TrainerSolveTimeCell from './TrainerSolveTimeCell'
import TrainerDeleteSolveButton from './TrainerDeleteSolveButton'
import type { TrainerSolveListItem } from '@/features/trainer/model/types'
import type { AlgorithmCollection } from '@/features/algorithms-list/model/types'
import { cn } from '@/shared/lib/utils'
import { buildVizConfig, formatRelative } from '@/features/trainer/lib/trainerUtils'

interface TrainerSolveHistoryTableProps {
  solves: TrainerSolveListItem[]
  isLoading?: boolean
  isLoadingMore?: boolean
  reachedEnd?: boolean
  onLoadMore?: () => void
  onDelete: (id: string) => void
  deletingIds?: Set<string>
  showCase?: boolean
  caseById?: Map<string, AlgorithmCollection>
  puzzle?: string
  vizDefaults?: Record<string, unknown>
  emptyLabel?: string
  targetMs?: number
}

const GRID_WITH_CASE = 'grid-cols-[28px_1fr_7rem_6rem_28px]'
const GRID_NO_CASE = 'grid-cols-[1fr_6rem_28px]'

export default function TrainerSolveHistoryTable({
  solves,
  isLoading,
  isLoadingMore,
  reachedEnd,
  onLoadMore,
  onDelete,
  deletingIds,
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
            const isDeleting = deletingIds?.has(solve._id) ?? false
            return (
              <motion.div
                key={solve._id}
                variants={{ hidden: { opacity: 0 }, show: { opacity: 1 } }}
                transition={{ duration: 0.2, ease: 'easeOut' }}
                aria-disabled={isDeleting}
                className={cn(
                  'grid items-center gap-x-4 px-3 py-2.5 border-b border-border/40 last:border-b-0',
                  'border-l-2 border-l-transparent transition-colors duration-150 hover:bg-muted/20 hover:border-l-primary',
                  isDeleting && 'opacity-40 pointer-events-none',
                  showCase ? GRID_WITH_CASE : GRID_NO_CASE
                )}
              >
                {showCase && (
                  <div className="size-6 rounded-sm overflow-hidden bg-muted/30 flex items-center justify-center">
                    {vizConfig ? <AlgorithmRender config={vizConfig} width={24} height={24} /> : null}
                  </div>
                )}

                <TrainerSolveTimeCell timeMs={solve.timeMs} targetMs={targetMs} />

                {showCase && (
                  <span className="truncate text-xs text-muted-foreground">{algCase?.name ?? solve.caseId}</span>
                )}

                <span className="text-xs text-muted-foreground tabular-nums">{formatRelative(solve.createdAt)}</span>

                <TrainerDeleteSolveButton
                  label={t('delete')}
                  pending={isDeleting}
                  onClick={() => onDelete(solve._id)}
                />
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
