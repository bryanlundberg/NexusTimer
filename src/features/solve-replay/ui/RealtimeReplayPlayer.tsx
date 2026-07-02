'use client'

import { useEffect, useRef, useState } from 'react'
import { TwistyPlayer } from 'cubing/twisty'
import { Pause, Play, RotateCcw, SkipBack, SkipForward } from 'lucide-react'
import { cn } from '@/shared/lib/utils'
import type { SolveReplay } from '@/entities/replay/model/types'
import { useRealtimeReplay } from '@/features/solve-replay/model/useRealtimeReplay'
import { disposeTwistyPlayer } from '@/shared/lib/twisty/disposeTwistyPlayer'

export interface ReplayMarker {
  key: string
  label: string
  moveIndex: number
  lineClass: string
  labelClass: string
}

interface BarSegment {
  key: string
  left: number
  width: number
  colorClass: string
}

interface RealtimeReplayPlayerProps {
  replay: SolveReplay
  markers?: ReplayMarker[]
  size?: number
  tempoScale?: number
}

function buildSegments(markers: ReplayMarker[], total: number): BarSegment[] {
  if (!markers.length || total === 0) return []
  let prev = 0
  return markers.map((marker, i) => {
    const right = i < markers.length - 1 ? (marker.moveIndex / total) * 100 : 100
    const seg = { key: marker.key, left: prev, width: right - prev, colorClass: marker.lineClass }
    prev = right
    return seg
  })
}

const ICON_BUTTON =
  'inline-flex items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-30'

export function RealtimeReplayPlayer({ replay, markers = [], size = 232, tempoScale = 4 }: RealtimeReplayPlayerProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [player, setPlayer] = useState<TwistyPlayer | null>(null)

  const { status, index, total, toggle, restart, next, prev, seek } = useRealtimeReplay({ player, replay })

  useEffect(() => {
    if (!containerRef.current) return
    const container = containerRef.current

    const twisty = new TwistyPlayer({
      puzzle: replay.puzzle as TwistyPlayer['puzzle'],
      experimentalSetupAlg: replay.scramble,
      experimentalSetupAnchor: 'start',
      controlPanel: 'none',
      tempoScale,
      background: 'none',
      experimentalDragInput: 'auto'
    })
    twisty.style.width = `${size}px`
    twisty.style.height = `${size}px`
    twisty.style.maxWidth = '100%'
    container.appendChild(twisty)
    setPlayer(twisty)

    return () => {
      disposeTwistyPlayer(twisty)
      setPlayer(null)
    }
  }, [replay, size])

  useEffect(() => {
    if (player) player.tempoScale = tempoScale
  }, [player, tempoScale])

  const isPlaying = status === 'playing'
  const pct = total > 0 ? (index / total) * 100 : 0
  const segments = buildSegments(markers, total)

  return (
    <div className="flex w-full flex-col items-center gap-4">
      <div ref={containerRef} className="rounded-lg" />

      <div className="flex w-full flex-col gap-3">
        {/* Progress bar with phase markers */}
        <div className="group relative flex-1 pt-8">
          {markers.map(({ key, label, moveIndex, lineClass, labelClass }) => (
            <div
              key={key}
              className="pointer-events-none absolute bottom-0 -translate-x-1/2 flex flex-col items-center"
              style={{ left: `${total > 0 ? (moveIndex / total) * 100 : 0}%` }}
            >
              <span
                className={cn('text-[10px] tabular-nums leading-none mb-6 me-2 block origin-bottom-right', labelClass)}
                style={{ transform: 'rotate(-80deg)' }}
              >
                {label}
              </span>
              <div className={cn('w-px h-3', lineClass)} />
            </div>
          ))}

          <div className="relative h-1.5 w-full overflow-hidden rounded-full bg-muted group-focus-within:ring-2 group-focus-within:ring-ring">
            {segments.map(({ key, left, width, colorClass }) => (
              <div
                key={key}
                className={cn('absolute inset-y-0', colorClass)}
                style={{ left: `${left}%`, width: `${width}%` }}
              />
            ))}
            {/* dim the unplayed portion */}
            <div className="absolute inset-y-0 right-0 bg-background/60" style={{ width: `${100 - pct}%` }} />
          </div>

          <input
            type="range"
            min={0}
            max={total}
            value={index}
            onChange={(event) => seek(Number(event.target.value))}
            aria-label="Reconstruction position"
            aria-valuetext={`Move ${index} of ${total}`}
            className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
          />
        </div>

        {/* Transport controls + counter */}
        <div className="flex items-center">
          <div className="flex-1" />
          <div className="flex items-center gap-1">
            <button type="button" aria-label="Restart" onClick={restart} className={cn(ICON_BUTTON, 'size-9')}>
              <RotateCcw className="size-4" />
            </button>
            <button
              type="button"
              aria-label="Previous move"
              onClick={prev}
              disabled={index <= 0}
              className={cn(ICON_BUTTON, 'size-9')}
            >
              <SkipBack className="size-4" />
            </button>
            <button
              type="button"
              aria-label={isPlaying ? 'Pause' : 'Play'}
              onClick={toggle}
              className="mx-1 inline-flex size-11 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-sm transition-transform hover:bg-primary/90 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              {isPlaying ? (
                <Pause className="size-5 fill-current" />
              ) : (
                <Play className="size-5 translate-x-px fill-current" />
              )}
            </button>
            <button
              type="button"
              aria-label="Next move"
              onClick={next}
              disabled={index >= total}
              className={cn(ICON_BUTTON, 'size-9')}
            >
              <SkipForward className="size-4" />
            </button>
          </div>
          <div className="flex-1 flex justify-end">
            <span className="font-mono text-xs tabular-nums text-muted-foreground">
              {index}/{total}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
