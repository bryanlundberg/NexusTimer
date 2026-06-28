'use client'

import _ from 'lodash'
import { useEffect, useRef, useState } from 'react'
import type { TwistyPlayer } from 'cubing/twisty'
import AlgorithmRender from '@/shared/ui/twisty/AlgorithmRender'
import { applyYellowOrientation } from '@/shared/lib/algorithms/vizConfig'
import type { ALGORITHM_SET } from '@/shared/const/algorithms-sets'
import type { LearnedCase } from '@/entities/trainer-learned/lib/buildLearnedMethods'

const SIZE = 96

export default function PeopleCaseVisual({ set, item }: { set: ALGORITHM_SET; item: LearnedCase }) {
  const ref = useRef<HTMLDivElement>(null)
  const [inView, setInView] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el || inView) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true)
          observer.disconnect()
        }
      },
      { rootMargin: '150px' }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [inView])

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
        alg: item.moves
      },
      viz
    )
  )

  return (
    <div className="flex flex-col items-center gap-1">
      <div
        ref={ref}
        className="flex items-center justify-center overflow-hidden rounded-lg bg-primary/5"
        style={{ width: SIZE, height: SIZE }}
      >
        {inView && item.moves ? (
          <AlgorithmRender config={config} width={SIZE} height={SIZE} />
        ) : (
          <div className="size-full rounded-lg bg-muted/40" />
        )}
      </div>
      <span className="text-[10px] font-medium leading-none text-center max-w-15 truncate">{item.name}</span>
    </div>
  )
}
