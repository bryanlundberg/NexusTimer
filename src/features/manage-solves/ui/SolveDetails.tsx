'use client'

import { useState } from 'react'
import formatTime from '@/shared/lib/formatTime'
import { useTimerStore } from '@/shared/model/timer/useTimerStore'
import { CalendarIcon, ClockIcon, CopyIcon } from '@radix-ui/react-icons'
import dayjs from '@/shared/lib/dayjs'
import { useLocale, useTranslations } from 'next-intl'
import { DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import ScrambleDisplay from '@/shared/ui/scramble-display/ui/ScrambleDisplay'
import { useOverlayStore } from '@/shared/model/overlay-store/useOverlayStore'
import { Solve } from '@/entities/solve/model/types'
import QuickActions from '@/features/manage-solves/ui/QuickActions'
import useQuickActions from '@/features/manage-solves/model/useQuickActions'
import { tryAnalyzeSolution } from '@/shared/lib/tryAnalyzeSolution'
import { formatTps } from '@/shared/lib/formatTps'
import { SolveBreakdown } from '@/features/manage-solves/ui/SolveBreakdown'
import { cn } from '@/shared/lib/utils'
import { RotateCw, Zap, Layers } from 'lucide-react'
import { Stat } from '@/features/replay-solve-details/ui/Stat'
import Segmented from '@/shared/ui/segmented/Segmented'

export default function SolveDetails() {
  const t = useTranslations('Index')
  const { activeOverlay } = useOverlayStore()
  const selectedCube = useTimerStore((state) => state.selectedCube)
  const setLastSolve = useTimerStore((state) => state.setLastSolve)
  const locale = useLocale()

  const solve = activeOverlay?.metadata as Solve | undefined
  const totalMs = solve?.time ?? 0

  const { handleCopyScramble } = useQuickActions(solve as Solve)

  const [visualization, setVisualization] = useState<'2D' | '3D'>('2D')

  const analysis = solve?.replay?.moves?.length ? tryAnalyzeSolution(solve.replay.moves) : null
  const moveCount = analysis ? analysis.turnCount : null
  const tps = analysis?.tps != null ? formatTps(analysis.tps) : null

  const solveDate = dayjs(solve?.endTime || 0).locale(locale)
  const formattedDate = solveDate.format('ll')
  const formattedTime = solveDate.format('HH:mm')
  const relative = solveDate.fromNow()

  const preventNestedDismiss = (event: Event) => {
    const target = event.target as Element | null
    if (target?.closest('[data-radix-popper-content-wrapper],[role="menu"],[role="alertdialog"]')) {
      event.preventDefault()
      return
    }
    if (document.querySelector('[role="menu"][data-state="open"],[role="alertdialog"][data-state="open"]')) {
      event.preventDefault()
    }
  }

  return (
    <DialogContent
      showCloseButton={false}
      className="gap-0 p-0 overflow-hidden max-h-[90dvh] sm:max-w-md flex flex-col"
      data-testid="solve-details-dialog-content"
      onInteractOutside={preventNestedDismiss}
    >
      <div className="overflow-y-auto scrollbar-hide flex-1">
        {/* Header */}
        <DialogHeader className="px-4 pt-4 pb-2 sm:px-5 items-center text-center">
          <div className="flex items-baseline justify-center gap-2">
            <DialogTitle className="text-2xl sm:text-3xl font-mono font-bold tracking-tight tabular-nums">
              {solve?.dnf ? 'DNF' : formatTime(totalMs)}
              {solve?.plus2 && !solve?.dnf && <span className="text-destructive text-base align-top">+</span>}
            </DialogTitle>
            <Badge variant="secondary" className="text-[10px]">
              {selectedCube?.category || t('solve-details.unknown-category')}
            </Badge>
          </div>
          <div className="flex items-center justify-center gap-2 text-[11px] text-muted-foreground mt-0.5">
            <span className="flex items-center gap-1">
              <CalendarIcon className="size-3" />
              {formattedDate} · {formattedTime}
            </span>
            <span className="text-border">·</span>
            <span className="flex items-center gap-1">
              <ClockIcon className="size-3" />
              {relative}
            </span>
          </div>
        </DialogHeader>

        {/* Stats + breakdown */}
        {analysis && (
          <div className="px-4 pb-3 sm:px-5 flex flex-col gap-3">
            <div className="grid grid-cols-3 gap-2">
              <Stat icon={<RotateCw className="size-3" />} label="Moves" value={moveCount ?? '—'} />
              <Stat icon={<Zap className="size-3" />} label="TPS" value={tps ?? '—'} />
              <Stat icon={<Layers className="size-3" />} label="Method" value={analysis.method ?? '—'} />
            </div>
            <SolveBreakdown analysis={analysis} totalMs={totalMs} />
          </div>
        )}

        {/* Scramble */}
        <div className="px-4 pb-3 sm:px-5">
          <div className="relative mb-1.5 px-8">
            <DialogDescription className="text-xs text-muted-foreground font-mono leading-relaxed select-all break-words text-center">
              {solve?.scramble}
            </DialogDescription>
            <button
              type="button"
              aria-label={t('tooltips.copy')}
              onClick={handleCopyScramble}
              className="absolute right-0 top-0 cursor-pointer p-1 text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
            >
              <CopyIcon className="size-3.5" />
            </button>
          </div>
          {solve?.comment && (
            <p
              data-testid="solve-comment"
              className="mb-2.5 px-4 text-xs text-muted-foreground text-center break-words whitespace-pre-wrap"
            >
              {solve.comment}
            </p>
          )}
          <div className="flex flex-col items-center gap-2.5">
            <div data-vaul-no-drag className="surface surface-well flex w-full justify-center p-3">
              <ScrambleDisplay
                show={true}
                scramble={solve?.scramble || ''}
                event={selectedCube?.category || '3x3'}
                className={cn(
                  'flex items-center justify-center',
                  visualization === '2D' ? 'w-36 h-26 sm:w-44 sm:h-32' : 'w-26 h-26 sm:w-32 sm:h-32'
                )}
                visualization={visualization}
              />
            </div>
            <Segmented
              value={visualization}
              onChange={setVisualization}
              layoutId="solve-details-visualization"
              options={[
                { value: '2D', label: '2D' },
                { value: '3D', label: '3D' }
              ]}
              className="text-xs [&>button]:px-4 [&>button]:py-1"
            />
          </div>
        </div>
      </div>

      {/* Actions - compact bottom bar */}
      <div className="shrink-0 border-t px-4 py-2.5 sm:px-5">
        {solve && <QuickActions solve={solve} variant="modal" onDeleteSolve={() => setLastSolve(null)} />}
      </div>
    </DialogContent>
  )
}
