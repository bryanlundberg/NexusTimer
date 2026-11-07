'use client'

import { useEffect, useRef, useState } from 'react'
import { TwistyPlayer } from '@rednaxela101/cubing/twisty'
import type { SolveReplay } from '@/entities/replay/model/types'
import type { ReplayView } from '@/features/solve-replay/model/replayView'
import { disposeTwistyPlayer } from '@/shared/lib/twisty/disposeTwistyPlayer'

interface TwistyReplayStageProps {
  replay: SolveReplay
  size: number
  tempoScale: number
  onReady: (view: ReplayView | null) => void
}

export default function TwistyReplayStage({ replay, size, tempoScale, onReady }: TwistyReplayStageProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [player, setPlayer] = useState<TwistyPlayer | null>(null)
  const onReadyRef = useRef(onReady)

  useEffect(() => {
    onReadyRef.current = onReady
  })

  useEffect(() => {
    if (!containerRef.current) return
    const container = containerRef.current

    const twisty = new TwistyPlayer({
      puzzle: replay.puzzle as TwistyPlayer['puzzle'],
      experimentalSetupAlg: replay.scramble,
      experimentalSetupAnchor: 'start',
      controlPanel: 'none',
      hintFacelets: 'none',
      tempoScale,
      background: 'none',
      experimentalDragInput: 'auto'
    })
    twisty.style.width = `${size}px`
    twisty.style.height = `${size}px`
    twisty.style.maxWidth = '100%'
    container.appendChild(twisty)
    setPlayer(twisty)
    onReadyRef.current({
      jumpTo: (moves) => {
        try {
          twisty.alg = moves.join(' ')
          twisty.jumpToEnd()
        } catch {}
      },
      animate: (move) => {
        try {
          twisty.experimentalAddMove(move)
        } catch {}
      }
    })

    return () => {
      onReadyRef.current(null)
      disposeTwistyPlayer(twisty)
      setPlayer(null)
    }
  }, [replay, size])

  useEffect(() => {
    if (player) player.tempoScale = tempoScale
  }, [player, tempoScale])

  return <div ref={containerRef} />
}
