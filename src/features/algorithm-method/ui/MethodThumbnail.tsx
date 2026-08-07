'use client'

import _ from 'lodash'
import { useEffect, useRef, useState } from 'react'
import type { TwistyPlayer } from 'cubing/twisty'
import AlgorithmRender from '@/shared/ui/twisty/AlgorithmRender'
import { applyYellowOrientation } from '@/shared/lib/algorithms/vizConfig'
import type { ALGORITHM_SET } from '@/shared/const/algorithms-sets'

const DEFAULT_SIZE = 76

export default function MethodThumbnail({ set, size = DEFAULT_SIZE }: { set: ALGORITHM_SET; size?: number }) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [inView, setInView] = useState(false)

  useEffect(() => {
    const el = containerRef.current
    if (!el || inView) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true)
          observer.disconnect()
        }
      },
      { rootMargin: '200px' }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [inView])

  const firstMoves = set.algorithms[0]?.algs[0]?.moves
  const viz = set.virtualization as unknown as Partial<TwistyPlayer>

  const config: Partial<TwistyPlayer> = applyYellowOrientation(
    _.merge(
      {
        visualization: 'experimental-2D-LL',
        background: 'none',
        controlPanel: 'none',
        experimentalStickering: 'OLL',
        experimentalSetupAnchor: 'end',
        experimentalDragInput: 'none',
        hintFacelets: 'none',
        alg: firstMoves
      },
      viz
    )
  )

  return (
    <div
      ref={containerRef}
      className="badge-notch flex shrink-0 items-center justify-center overflow-hidden border border-border/70 bg-primary/[0.07] p-1.5 transition-colors duration-200 group-hover:border-primary/40 group-hover:bg-primary/[0.12]"
      style={{ width: size, height: size }}
    >
      {inView && firstMoves ? (
        <AlgorithmRender config={config} width={size - 14} height={size - 14} />
      ) : (
        <div className="size-full animate-pulse bg-muted/50" />
      )}
    </div>
  )
}
