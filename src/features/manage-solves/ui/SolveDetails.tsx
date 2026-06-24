'use client'

import formatTime from '@/shared/lib/formatTime'
import { useTimerStore } from '@/shared/model/timer/useTimerStore'
import { CalendarIcon, ClockIcon } from '@radix-ui/react-icons'
import { DateTime } from 'luxon'
import { useLocale, useTranslations } from 'next-intl'
import { DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import ScrambleDisplay from '@/shared/ui/scramble-display/ui/ScrambleDisplay'
import { useOverlayStore } from '@/shared/model/overlay-store/useOverlayStore'
import { Solve } from '@/entities/solve/model/types'
import QuickActions from '@/features/manage-solves/ui/QuickActions'
import { tryAnalyzeSolution } from '@/shared/lib/tryAnalyzeSolution'
import { formatTps } from '@/shared/lib/formatTps'
import { SolveBreakdown } from '@/features/manage-solves/ui/SolveBreakdown'
import type { ReplayMove } from '@/entities/replay/model/types'

export default function SolveDetails() {
  const t = useTranslations('Index')
  const { activeOverlay } = useOverlayStore()
  const selectedCube = useTimerStore((state) => state.selectedCube)
  const setLastSolve = useTimerStore((state) => state.setLastSolve)
  const locale = useLocale()

  const solve = activeOverlay?.metadata as Solve | undefined
  const totalMs = solve?.time ?? 0

  const analysis = solve?.replay?.moves?.length ? tryAnalyzeSolution(solve.replay.moves) : null
  const moveCount = analysis ? (analysis.moves as ReplayMove[]).length : null
  const tps = analysis?.tps != null ? formatTps(analysis.tps) : null

  const formattedDate = DateTime.fromMillis(solve?.endTime || 0)
    .setLocale(locale)
    .toFormat('DDDD')
  const formattedTime = DateTime.fromMillis(solve?.endTime || 0)
    .setLocale(locale)
    .toFormat('HH:mm:ss')

  return (
    <DialogContent
      showCloseButton={true}
      className="gap-0 p-0 overflow-hidden max-h-[90dvh] flex flex-col"
      data-testid="solve-details-dialog-content"
    >
      <div className="overflow-y-auto flex-1">
        {/* Header */}
        <DialogHeader className="px-4 pt-4 pb-3 sm:px-5 sm:pt-5 items-center text-center">
          <div className="flex items-baseline justify-center gap-2">
            <DialogTitle className="text-2xl sm:text-3xl font-mono font-bold tracking-tight tabular-nums">
              {formatTime(totalMs)}
            </DialogTitle>
            <Badge variant="secondary" className="text-[10px]">
              {selectedCube?.category || t('solve-details.unknown-category')}
            </Badge>
          </div>
          <div className="flex items-center justify-center gap-2 text-[11px] text-muted-foreground mt-1">
            <span className="flex items-center gap-1">
              <CalendarIcon className="size-3" />
              {formattedDate}
            </span>
            <span className="text-border">·</span>
            <span className="flex items-center gap-1">
              <ClockIcon className="size-3" />
              {formattedTime}
            </span>
          </div>
        </DialogHeader>

        {/* Stats + breakdown */}
        {analysis && (
          <div className="px-4 pb-4 sm:px-5 flex flex-col gap-4">
            <div className="grid grid-cols-3 divide-x divide-border/60 rounded-lg border bg-muted/30">
              <div className="flex flex-col items-center gap-0.5 px-2 py-2">
                <span className="text-[10px] text-muted-foreground uppercase tracking-wide">Moves</span>
                <span className="font-mono text-sm font-semibold tabular-nums">{moveCount ?? '—'}</span>
              </div>
              <div className="flex flex-col items-center gap-0.5 px-2 py-2">
                <span className="text-[10px] text-muted-foreground uppercase tracking-wide">TPS</span>
                <span className="font-mono text-sm font-semibold tabular-nums">{tps ?? '—'}</span>
              </div>
              <div className="flex flex-col items-center gap-0.5 px-2 py-2">
                <span className="text-[10px] text-muted-foreground uppercase tracking-wide">Method</span>
                <span className="font-mono text-sm font-semibold tabular-nums">{analysis.method ?? '—'}</span>
              </div>
            </div>
            <SolveBreakdown analysis={analysis} totalMs={totalMs} />
          </div>
        )}

        {/* Scramble */}
        <div className="px-4 pb-3 sm:px-5">
          <DialogDescription className="text-xs text-muted-foreground mb-2 font-mono leading-relaxed select-all break-words text-center">
            {solve?.scramble}
          </DialogDescription>
          <div className="rounded-md bg-muted/40 p-1.5">
            <ScrambleDisplay
              show={true}
              scramble={solve?.scramble || ''}
              event={selectedCube?.category || '3x3'}
              className="h-16 sm:h-20 md:h-24"
              visualization="2D"
            />
          </div>
        </div>
      </div>

      {/* Actions - compact bottom bar */}
      <div className="px-4 py-2.5 border-t shrink-0 sm:px-5">
        {solve && <QuickActions solve={solve} onDeleteSolve={() => setLastSolve(null)} />}
      </div>
    </DialogContent>
  )
}
