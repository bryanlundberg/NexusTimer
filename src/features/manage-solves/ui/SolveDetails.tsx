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
import { FaceGlyph } from '@/shared/ui/face-glyph/FaceGlyph'
import { startFaceLayer } from '@/shared/lib/startFaceLayer'

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
  const startColor = startFaceLayer(analysis)

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
      className="gap-0 p-0 overflow-hidden max-h-[90dvh] sm:max-w-lg flex flex-col"
      data-testid="solve-details-dialog-content"
      onInteractOutside={preventNestedDismiss}
    >
      <div className="overflow-y-auto scrollbar-hide flex-1">
        {/* Header */}
        <DialogHeader className="px-5 pt-6 pb-3 sm:px-6 items-center text-center">
          <div className="flex items-baseline justify-center gap-2">
            <DialogTitle className="text-4xl sm:text-5xl font-mono font-bold tracking-tight tabular-nums">
              {solve?.dnf ? 'DNF' : formatTime(totalMs)}
              {solve?.plus2 && !solve?.dnf && <span className="text-destructive text-xl align-top">+</span>}
            </DialogTitle>
            <Badge variant="secondary" className="text-xs">
              {selectedCube?.category || t('solve-details.unknown-category')}
            </Badge>
          </div>
          <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground mt-1">
            <span className="flex items-center gap-1">
              <CalendarIcon className="size-3.5" />
              {formattedDate} · {formattedTime}
            </span>
            <span className="text-border">·</span>
            <span className="flex items-center gap-1">
              <ClockIcon className="size-3.5" />
              {relative}
            </span>
          </div>
        </DialogHeader>

        {/* Stats + breakdown */}
        {analysis && (
          <div className="px-5 pb-4 sm:px-6 flex flex-col gap-3">
            <div className="grid grid-cols-3 gap-2">
              <Stat icon={<RotateCw className="size-3" />} label="Moves" value={moveCount ?? '—'} />
              <Stat icon={<Zap className="size-3" />} label="TPS" value={tps ?? '—'} />
              <Stat
                icon={startColor ? <FaceGlyph color={startColor} className="size-3" /> : <Layers className="size-3" />}
                label="Method"
                value={analysis.method ?? '—'}
              />
            </div>
            <SolveBreakdown analysis={analysis} totalMs={totalMs} />
          </div>
        )}

        {/* Scramble */}
        <div className="px-5 pb-5 sm:px-6">
          <div className="relative mb-2.5 px-8">
            <DialogDescription className="text-sm text-muted-foreground font-mono leading-relaxed select-all break-words text-center">
              {solve?.scramble}
            </DialogDescription>
            <button
              type="button"
              aria-label={t('tooltips.copy')}
              onClick={handleCopyScramble}
              className="absolute right-0 top-0 cursor-pointer p-1 text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
            >
              <CopyIcon className="size-4" />
            </button>
          </div>
          {solve?.comment && (
            <p
              data-testid="solve-comment"
              className="mb-3 px-4 text-sm text-muted-foreground text-center break-words whitespace-pre-wrap"
            >
              {solve.comment}
            </p>
          )}
          <div className="flex flex-col items-center gap-3">
            <div data-vaul-no-drag className="surface surface-well flex w-full justify-center p-4">
              <ScrambleDisplay
                show={true}
                scramble={solve?.scramble || ''}
                event={selectedCube?.category || '3x3'}
                className={cn(
                  'flex items-center justify-center',
                  visualization === '2D' ? 'w-44 h-32 sm:w-55 sm:h-40' : 'w-32 h-32 sm:w-40 sm:h-40'
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
              className="text-sm [&>button]:px-5 [&>button]:py-1.5"
            />
          </div>
        </div>
      </div>

      {/* Actions - compact bottom bar */}
      <div className="shrink-0 border-t px-5 py-3 sm:px-6">
        {solve && <QuickActions solve={solve} variant="modal" onDeleteSolve={() => setLastSolve(null)} />}
      </div>
    </DialogContent>
  )
}
