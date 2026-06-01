'use client'

import { useEffect, useRef, useState } from 'react'
import { TwistyPlayer } from 'cubing/twisty'
import { Pause, Play, RotateCcw, SkipBack, SkipForward } from 'lucide-react'
import { cn } from '@/shared/lib/utils'
import type { SolveReplay } from '@/entities/replay/model/types'
import { useRealtimeReplay } from '@/features/solve-replay/model/useRealtimeReplay'

interface RealtimeReplayPlayerProps {
  replay: SolveReplay
  size?: number
}

const ICON_BUTTON =
  'inline-flex items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-30'

export function RealtimeReplayPlayer({ replay, size = 232 }: RealtimeReplayPlayerProps) {
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
      tempoScale: 4,
      background: 'none',
      experimentalDragInput: 'auto'
    })
    twisty.style.width = `${size}px`
    twisty.style.height = `${size}px`
    twisty.style.maxWidth = '100%'
    container.appendChild(twisty)
    setPlayer(twisty)

    return () => {
      try {
        twisty.remove()
      } catch {}
      setPlayer(null)
    }
  }, [replay, size])

  const isPlaying = status === 'playing'
  const pct = total > 0 ? (index / total) * 100 : 0

  return (
    <div className="flex w-full flex-col items-center gap-4">
      <div ref={containerRef} className="rounded-lg" />

      <div className="flex w-full flex-col gap-3">
        <div className="flex items-center gap-3">
          <div className="group relative flex-1">
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted group-focus-within:ring-2 group-focus-within:ring-ring">
              <div
                className="h-full rounded-full bg-primary transition-[width] duration-150"
                style={{ width: `${pct}%` }}
              />
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
          <span className="min-w-[3.25rem] text-right font-mono text-xs tabular-nums text-muted-foreground">
            {index}/{total}
          </span>
        </div>

        <div className="flex items-center justify-center gap-1">
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
      </div>
    </div>
  )
}
