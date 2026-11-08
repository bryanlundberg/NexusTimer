'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import type { SolveReplay } from '@/entities/replay/model/types'
import type { ReplayView } from '@/features/solve-replay/model/replayView'
import type { Puzzle3dHandle } from '@/shared/lib/puzzle/mountPuzzle3d'
import { renderPuzzleImage } from '@/shared/lib/puzzle/puzzleImages'
import CubeImage from '@/shared/ui/puzzle/CubeImage'

interface PuzzleReplayStageProps {
  replay: SolveReplay
  size: number
  tempoScale: number
  onReady: (view: ReplayView | null) => void
}

export default function PuzzleReplayStage({ replay, size, tempoScale, onReady }: PuzzleReplayStageProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const onReadyRef = useRef(onReady)
  const tempoRef = useRef(tempoScale)
  const [handle, setHandle] = useState<Puzzle3dHandle | null>(null)
  const [flatAlg, setFlatAlg] = useState<string | null>(null)
  const { puzzle, scramble } = replay

  useEffect(() => {
    onReadyRef.current = onReady
    tempoRef.current = tempoScale
  })

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    let cancelled = false
    let mounted: Puzzle3dHandle | null = null
    let observer: ResizeObserver | null = null
    const withScramble = (moves: readonly string[]) => [scramble, ...moves].join(' ')

    import('@/shared/lib/puzzle/mountPuzzle3d').then(({ mountPuzzle3d }) => {
      if (cancelled) return
      mounted = mountPuzzle3d(canvas, puzzle, scramble, { tempoScale: tempoRef.current })
      if (!mounted) {
        let played: string[] = []
        setFlatAlg(scramble)
        onReadyRef.current({
          jumpTo: (moves) => {
            played = [...moves]
            setFlatAlg(withScramble(played))
          },
          animate: (move) => {
            played = [...played, move]
            setFlatAlg(withScramble(played))
          }
        })
        return
      }
      const current = mounted
      observer = new ResizeObserver(() => current.resize())
      observer.observe(canvas)
      setHandle(current)
      onReadyRef.current({
        jumpTo: (moves) => current.show(withScramble(moves)),
        animate: (move) => current.play(move)
      })
    })

    return () => {
      cancelled = true
      observer?.disconnect()
      mounted?.dispose()
      setHandle(null)
      setFlatAlg(null)
      onReadyRef.current(null)
    }
  }, [puzzle, scramble])

  useEffect(() => {
    handle?.setTempoScale(tempoScale)
  }, [handle, tempoScale])

  const flat = useMemo(() => (flatAlg === null ? null : renderPuzzleImage(puzzle, flatAlg, 'net')), [puzzle, flatAlg])
  const style = { width: size, height: size, maxWidth: '100%' }

  return (
    <>
      <canvas ref={canvasRef} style={{ ...style, display: flatAlg === null ? 'block' : 'none' }} />
      {flatAlg !== null && (flat ? <CubeImage svg={flat} style={style} /> : <div style={style} />)}
    </>
  )
}
