'use client'

import { useEffect, useRef, useState } from 'react'
import { useReducedMotion } from 'motion/react'

const TRAVEL_S = 1.8

export default function FlowLines({
  points,
  direction,
  height = 64
}: {
  points: number[]
  direction: 'in' | 'out'
  height?: number
}) {
  const reduce = useReducedMotion()
  const ref = useRef<SVGSVGElement>(null)
  const [width, setWidth] = useState(0)

  useEffect(() => {
    const svg = ref.current
    if (!svg) return
    const observer = new ResizeObserver(([entry]) => setWidth(Math.round(entry.contentRect.width)))
    observer.observe(svg)
    return () => observer.disconnect()
  }, [])

  const center = width / 2

  return (
    <svg ref={ref} aria-hidden viewBox={`0 0 ${width || 1} ${height}`} style={{ height }} className="block w-full">
      {width > 0 &&
        points.map((ratio, i) => {
          const x = width * ratio
          const [from, to] = direction === 'in' ? [x, center] : [center, x]
          const d = `M${from} 0 C${from} ${height * 0.55} ${to} ${height * 0.45} ${to} ${height}`
          return (
            <g key={ratio}>
              <path d={d} fill="none" stroke="var(--border)" strokeWidth="1.5" strokeDasharray="4 6">
                {reduce ? null : (
                  <animate attributeName="stroke-dashoffset" from="10" to="0" dur="0.6s" repeatCount="indefinite" />
                )}
              </path>
              {reduce ? null : (
                <rect x="-3" y="-3" width="6" height="6" fill="var(--primary)">
                  <animateMotion
                    dur={`${TRAVEL_S}s`}
                    begin={`${(i * 0.37).toFixed(2)}s`}
                    repeatCount="indefinite"
                    path={d}
                  />
                </rect>
              )}
            </g>
          )
        })}
    </svg>
  )
}
