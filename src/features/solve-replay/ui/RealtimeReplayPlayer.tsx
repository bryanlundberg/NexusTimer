'use client'

import * as React from 'react'
import { useEffect, useRef, useState } from 'react'
import { TwistyPlayer } from 'cubing/twisty'
import { Pause, Play, RotateCcw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { SolveReplay } from '@/entities/replay/model/types'
import { useRealtimeReplay } from '@/features/solve-replay/model/useRealtimeReplay'

interface RealtimeReplayPlayerProps {
  replay: SolveReplay
  size?: number
}

const SPEEDS = [0.5, 1, 2] as const

export function RealtimeReplayPlayer({ replay, size = 300 }: RealtimeReplayPlayerProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [player, setPlayer] = useState<TwistyPlayer | null>(null)

  const { status, speed, setSpeed, play, pause, resume, restart } = useRealtimeReplay({ player, replay })

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
      experimentalDragInput: 'none'
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

  const handlePrimary = () => {
    if (isPlaying) pause()
    else if (status === 'paused') resume()
    else play()
  }

  return (
    <div className="flex flex-col items-center gap-3">
      <div ref={containerRef} className="rounded-md overflow-hidden" />

      <div className="flex items-center gap-2">
        <Button type="button" size="sm" variant="secondary" onClick={handlePrimary} className="gap-1.5">
          {isPlaying ? <Pause className="size-4" /> : <Play className="size-4" />}
          {isPlaying ? 'Pause' : status === 'paused' ? 'Resume' : 'Play'}
        </Button>

        <Button
          type="button"
          size="sm"
          variant="ghost"
          onClick={restart}
          disabled={status === 'idle'}
          className="gap-1.5"
        >
          <RotateCcw className="size-4" />
          Restart
        </Button>

        <div className="flex items-center rounded-md border p-0.5">
          {SPEEDS.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setSpeed(s)}
              className={`px-2 py-0.5 text-xs rounded-sm tabular-nums transition-colors ${
                speed === s ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {s}x
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
