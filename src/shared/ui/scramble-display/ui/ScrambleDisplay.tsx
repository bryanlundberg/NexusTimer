import { useEffect, useRef } from 'react'
import { PuzzleID, TwistyPlayer } from 'cubing/twisty'
import { CubeCategory } from '@/shared/const/cube-categories'
import { cubeCollection } from '@/shared/const/cube-collection'
import { disposeTwistyPlayer } from '@/shared/lib/twisty/disposeTwistyPlayer'

interface ScrambleDisplay extends React.HTMLAttributes<HTMLDivElement> {
  className?: string
  show: boolean
  scramble: string | null
  event: CubeCategory
  visualization?: '2D' | '3D'
  puzzle?: PuzzleID
}

export default function ScrambleDisplay({
  show,
  scramble,
  event,
  className,
  visualization = '2D',
  puzzle,
  ...rest
}: ScrambleDisplay) {
  const containerRef = useRef<HTMLDivElement>(null)
  const playerRef = useRef<TwistyPlayer | null>(null)

  useEffect(() => {
    if (!show || !containerRef.current) return

    const id = cubeCollection.find((u) => u.name === event)
    const displayId = id?.displayId ?? '3x3x3'

    const player = new TwistyPlayer({
      puzzle: puzzle ?? (displayId || '3x3x3'),
      alg: scramble ?? '',
      hintFacelets: 'none',
      background: 'none',
      controlPanel: 'none',
      visualization: visualization
    })
    playerRef.current = player

    containerRef.current.appendChild(player)

    player.style.width = '100%'
    player.style.height = 'auto'
    player.style.maxWidth = '100%'
    player.style.minHeight = '100%'

    return () => {
      disposeTwistyPlayer(player)
      playerRef.current = null
    }
  }, [show, event, visualization, puzzle])

  // Update the algorithm in place on the existing player instead of rebuilding.
  useEffect(() => {
    const player = playerRef.current
    if (!player) return
    try {
      player.alg = scramble ?? ''
    } catch {
      // ignore invalid alg
    }
  }, [scramble])

  if (!show) return null

  return <div {...rest} className={className} id="scramble-display" ref={containerRef}></div>
}
