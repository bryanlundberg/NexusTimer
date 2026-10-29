'use client'

import { useReducedMotion } from 'motion/react'

const HEIGHT = 440
const WIDTH = 160
const SOURCES = [60, 150, 220, 290, 380]
const TRAVEL_S = 2.2

export default function ConvergeLines() {
  const reduce = useReducedMotion()

  return (
    <svg aria-hidden viewBox={`0 0 ${WIDTH} ${HEIGHT}`} className="block h-[440px] w-full">
      {SOURCES.map((y, i) => {
        const d = `M0 ${y} C${WIDTH * 0.55} ${y} ${WIDTH * 0.45} ${HEIGHT / 2} ${WIDTH} ${HEIGHT / 2}`
        return (
          <g key={y}>
            <path d={d} fill="none" stroke="var(--border)" strokeWidth="1.5" strokeDasharray="4 6">
              {reduce ? null : (
                <animate attributeName="stroke-dashoffset" from="10" to="0" dur="0.6s" repeatCount="indefinite" />
              )}
            </path>
            {reduce
              ? null
              : [0, 0.5].map((offset) => (
                  <rect key={offset} x="-3" y="-3" width="6" height="6" fill="var(--primary)">
                    <animateMotion
                      dur={`${TRAVEL_S}s`}
                      begin={`${(i * 0.37 + offset * TRAVEL_S).toFixed(2)}s`}
                      repeatCount="indefinite"
                      path={d}
                    />
                  </rect>
                ))}
          </g>
        )
      })}
    </svg>
  )
}
