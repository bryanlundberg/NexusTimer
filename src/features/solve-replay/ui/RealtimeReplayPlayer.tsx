'use client'

import { useMemo, useState } from 'react'
import { useTranslations } from 'next-intl'
import { Pause, Play, Repeat, RotateCcw, SkipBack, SkipForward, StepBack, StepForward } from 'lucide-react'
import { cn } from '@/shared/lib/utils'
import { buttonVariants } from '@/components/ui/button'
import formatTime from '@/shared/lib/formatTime'
import type { SolveReplay } from '@/entities/replay/model/types'
import type { ReplayView } from '@/features/solve-replay/model/replayView'
import type { ReplayMarker } from '@/features/solve-replay/model/replayMarker'
import { useRealtimeReplay } from '@/features/solve-replay/model/useRealtimeReplay'
import CubeReplayStage from '@/features/solve-replay/ui/CubeReplayStage'
import PuzzleReplayStage from '@/features/solve-replay/ui/PuzzleReplayStage'
import ReplayProgressBar from '@/features/solve-replay/ui/ReplayProgressBar'
import ReplayPhaseChips from '@/features/solve-replay/ui/ReplayPhaseChips'
import ReplaySpeedMenu from '@/features/solve-replay/ui/ReplaySpeedMenu'
import ReplayMoveList from '@/features/solve-replay/ui/ReplayMoveList'
import { buildPlaybackReplay } from '@/features/solve-replay/lib/buildPlaybackReplay'
import {
  activePhaseIndex,
  buildBarSegments,
  buildPhaseRanges,
  type MoveSpan
} from '@/features/solve-replay/lib/replayTimeline'
import { cubeSizeOf } from '@/shared/lib/puzzle/renderCubeImage'

export type { ReplayMarker } from '@/features/solve-replay/model/replayMarker'

interface RealtimeReplayPlayerProps {
  replay: SolveReplay
  markers?: ReplayMarker[]
  size?: number
  tempoScale?: number
  showClock?: boolean
  movesLabel?: string
  moveGroups?: readonly MoveSpan[]
}

const ICON_BUTTON =
  'inline-flex size-9 items-center justify-center text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-30'

export function RealtimeReplayPlayer({
  replay: source,
  markers: sourceMarkers = [],
  size = 232,
  tempoScale = 4,
  showClock = true,
  movesLabel,
  moveGroups
}: RealtimeReplayPlayerProps) {
  const t = useTranslations('Index.ReplayPlayer')
  const { replay, skipped } = useMemo(() => buildPlaybackReplay(source), [source])
  const [view, setView] = useState<ReplayView | null>(null)
  const [speed, setSpeed] = useState(1)
  const [loop, setLoop] = useState(false)
  const cubeSize = cubeSizeOf(replay.puzzle)

  const { status, index, total, toggle, next, prev, seek, jump } = useRealtimeReplay({ view, replay, speed, loop })

  const ranges = useMemo(() => {
    const markers = skipped
      ? sourceMarkers.map((marker) => ({ ...marker, moveIndex: Math.max(0, marker.moveIndex - skipped) }))
      : sourceMarkers
    return buildPhaseRanges(markers, total)
  }, [sourceMarkers, skipped, total])
  const segments = useMemo(() => buildBarSegments(ranges, total), [ranges, total])
  const moves = useMemo(() => replay.moves.map((move) => move.m), [replay])

  const isPlaying = status === 'playing'
  const isDone = status === 'done'
  const timeAt = (n: number) => (n === 0 ? 0 : replay.moves[n - 1].t)
  const endTime = Math.max(replay.durationMs, timeAt(total))
  const describe = (n: number) => {
    const parts = [`${n}/${total}`]
    if (n > 0) parts.push(moves[n - 1])
    if (showClock) parts.push(formatTime(timeAt(n)))
    return parts.join(' · ')
  }
  const stageTempo = tempoScale * speed

  return (
    <div className="flex w-full flex-col items-center gap-4">
      {cubeSize ? (
        <CubeReplayStage replay={replay} cubeSize={cubeSize} size={size} tempoScale={stageTempo} onReady={setView} />
      ) : (
        <PuzzleReplayStage replay={replay} size={size} tempoScale={stageTempo} onReady={setView} />
      )}

      {ranges.length > 0 && (
        <ReplayPhaseChips ranges={ranges} active={activePhaseIndex(ranges, index)} onSelect={jump} />
      )}

      <div className="flex w-full flex-col gap-1.5">
        <ReplayProgressBar index={index} total={total} segments={segments} onSeek={seek} describe={describe} />

        <div className="flex items-center justify-between font-mono text-[11px] tabular-nums text-muted-foreground">
          <span>
            {showClock && (
              <>
                <span className="text-foreground">{formatTime(timeAt(index))}</span> / {formatTime(endTime)}
              </>
            )}
          </span>
          <span>
            {index}/{total}
          </span>
        </div>

        <div className="flex items-center">
          <div className="flex flex-1">
            <ReplaySpeedMenu speed={speed} onChange={setSpeed} />
          </div>
          <div className="flex items-center gap-0.5">
            <button
              type="button"
              aria-label={t('go-to-start')}
              onClick={() => seek(0)}
              disabled={index <= 0}
              className={ICON_BUTTON}
            >
              <SkipBack className="size-4" />
            </button>
            <button
              type="button"
              aria-label={t('previous-move')}
              onClick={prev}
              disabled={index <= 0}
              className={ICON_BUTTON}
            >
              <StepBack className="size-4" />
            </button>
            <button
              type="button"
              aria-label={t(isPlaying ? 'pause' : isDone ? 'replay' : 'play')}
              onClick={toggle}
              className={cn(buttonVariants({ size: 'icon' }), 'mx-1 size-11')}
            >
              {isPlaying ? (
                <Pause className="size-5 fill-current" />
              ) : isDone ? (
                <RotateCcw className="size-5" />
              ) : (
                <Play className="size-5 translate-x-px fill-current" />
              )}
            </button>
            <button
              type="button"
              aria-label={t('next-move')}
              onClick={next}
              disabled={index >= total}
              className={ICON_BUTTON}
            >
              <StepForward className="size-4" />
            </button>
            <button
              type="button"
              aria-label={t('go-to-end')}
              onClick={() => seek(total)}
              disabled={index >= total}
              className={ICON_BUTTON}
            >
              <SkipForward className="size-4" />
            </button>
          </div>
          <div className="flex flex-1 justify-end">
            <button
              type="button"
              aria-label={t('loop')}
              aria-pressed={loop}
              onClick={() => setLoop((value) => !value)}
              className={cn(ICON_BUTTON, 'size-8', loop && 'bg-muted text-foreground')}
            >
              <Repeat className="size-4" />
            </button>
          </div>
        </div>
      </div>

      {movesLabel && (
        <ReplayMoveList
          label={movesLabel}
          moves={moves}
          index={index}
          onSelect={jump}
          lines={ranges}
          groups={moveGroups}
        />
      )}
    </div>
  )
}
