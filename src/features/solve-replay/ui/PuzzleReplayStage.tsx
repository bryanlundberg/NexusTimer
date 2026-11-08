'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import type { SolveReplay } from '@/entities/replay/model/types'
import type { ReplayView } from '@/features/solve-replay/model/replayView'
import { renderPuzzleImage } from '@/shared/lib/puzzle/puzzleImages'
import CubeImage from '@/shared/ui/puzzle/CubeImage'
import { usePuzzle3d } from '@/shared/ui/puzzle/usePuzzle3d'

interface PuzzleReplayStageProps {
  replay: SolveReplay
  size: number
  tempoScale: number
  onReady: (view: ReplayView | null) => void
}

interface FlatPosition {
  readonly scramble: string
  readonly moves: readonly string[]
}

const withScramble = (scramble: string, moves: readonly string[]) => [scramble, ...moves].join(' ')

export default function PuzzleReplayStage({ replay, size, tempoScale, onReady }: PuzzleReplayStageProps) {
  const { puzzle, scramble } = replay
  const { canvasRef, handle, unsupported } = usePuzzle3d({ puzzle, initialAlg: scramble, tempoScale })
  const onReadyRef = useRef(onReady)
  const [flatPosition, setFlatPosition] = useState<FlatPosition>({ scramble, moves: [] })

  useEffect(() => {
    onReadyRef.current = onReady
  })

  useEffect(() => {
    if (!handle) return
    handle.show(scramble)
    onReadyRef.current({
      jumpTo: (moves) => handle.show(withScramble(scramble, moves)),
      animate: (move) => handle.play(move)
    })
    return () => onReadyRef.current(null)
  }, [handle, scramble])

  useEffect(() => {
    if (!unsupported) return
    onReadyRef.current({
      jumpTo: (moves) => setFlatPosition({ scramble, moves: [...moves] }),
      animate: (move) =>
        setFlatPosition((prev) => ({ scramble, moves: [...(prev.scramble === scramble ? prev.moves : []), move] }))
    })
    return () => onReadyRef.current(null)
  }, [unsupported, scramble])

  const flatMoves = flatPosition.scramble === scramble ? flatPosition.moves : []
  const flatAlg = unsupported ? withScramble(scramble, flatMoves) : null
  const flat = useMemo(() => (flatAlg === null ? null : renderPuzzleImage(puzzle, flatAlg, 'net')), [puzzle, flatAlg])
  const style = { width: size, height: size, maxWidth: '100%' }

  return (
    <>
      <canvas ref={canvasRef} style={{ ...style, display: unsupported ? 'none' : 'block' }} />
      {unsupported && (flat ? <CubeImage svg={flat} style={style} /> : <div style={style} />)}
    </>
  )
}
