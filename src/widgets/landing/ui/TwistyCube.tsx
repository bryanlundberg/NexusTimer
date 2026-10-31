'use client'

import { useEffect, useRef, useState } from 'react'
import type { TwistyPlayer } from '@rednaxela101/cubing/twisty'
import { disposeTwistyPlayer } from '@/shared/lib/twisty/disposeTwistyPlayer'
import { DEMO_SEQUENCE } from '../lib/cubeMoves'

const QUARTER_MS = 420
const HALF_MS = 620

export default function TwistyCube({
  size,
  load,
  move,
  step,
  onTurned
}: {
  size: number
  load: boolean
  move: string | null
  step: number
  onTurned: () => void
}) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [player, setPlayer] = useState<TwistyPlayer | null>(null)
  const appliedStep = useRef(-1)
  const turnTimer = useRef<number | undefined>(undefined)
  const onTurnedRef = useRef(onTurned)

  useEffect(() => {
    onTurnedRef.current = onTurned
  })

  useEffect(() => {
    if (!load || player) return
    let cancelled = false
    import('@rednaxela101/cubing/twisty').then(({ TwistyPlayer }) => {
      const container = containerRef.current
      if (cancelled || !container) return
      const next = new TwistyPlayer({
        puzzle: '3x3x3',
        controlPanel: 'none',
        hintFacelets: 'none',
        background: 'none',
        tempoScale: 3,
        experimentalDragInput: 'none'
      })
      next.style.width = `${size}px`
      next.style.height = `${size}px`
      container.appendChild(next)
      setPlayer(next)
    })
    return () => {
      cancelled = true
    }
  }, [load, player, size])

  useEffect(() => {
    if (!player || !move || appliedStep.current === step) return
    appliedStep.current = step
    try {
      if (step > 0 && step % DEMO_SEQUENCE.length === 0) player.alg = ''
      player.experimentalAddMove(move)
    } catch {}
    turnTimer.current = window.setTimeout(() => onTurnedRef.current(), move.endsWith('2') ? HALF_MS : QUARTER_MS)
  }, [player, move, step])

  useEffect(() => {
    return () => {
      window.clearTimeout(turnTimer.current)
      disposeTwistyPlayer(player)
    }
  }, [player])

  return <div ref={containerRef} style={{ width: size, height: size }} />
}
