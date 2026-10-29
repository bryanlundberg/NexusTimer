'use client'

import { useReducedMotion } from 'motion/react'
import * as m from 'motion/react-m'
import { Bluetooth } from 'lucide-react'
import SpinningCube from './SpinningCube'

export default function SmartCubeVisual() {
  const reduce = useReducedMotion()
  const moves = ['R', "U'", 'F2', "L'"]

  return (
    <div className="relative flex h-28 items-center justify-center overflow-hidden">
      {/* radar rings */}
      {[0, 1, 2].map((i) => (
        <m.span
          key={i}
          className="absolute rounded-full border border-[var(--cube-blue)]"
          style={{ width: 80, height: 80 }}
          animate={reduce ? undefined : { scale: [1, 1.9], opacity: [0.45, 0] }}
          transition={{ duration: 2.6, delay: i * 0.85, repeat: Infinity, ease: 'easeOut' }}
        />
      ))}

      <span className="relative z-10 flex size-20 items-center justify-center rounded-full bg-foreground/5 ring-1 ring-border">
        <SpinningCube size={42} />
        {/* bluetooth chip */}
        <span className="absolute -bottom-1 -right-1 z-20 flex size-6 items-center justify-center rounded-full bg-[var(--cube-blue)] ring-2 ring-card">
          <Bluetooth className="size-3.5 text-white" />
        </span>
      </span>

      {moves.map((move, i) => (
        <m.span
          key={i}
          className="absolute z-20 font-mono text-xs font-bold text-foreground/70"
          style={{ left: `${10 + i * 24}%`, bottom: 4 }}
          animate={reduce ? { opacity: 0.5 } : { y: [6, -70], opacity: [0, 0.8, 0] }}
          transition={{ duration: 3, delay: i * 0.6, repeat: Infinity, ease: 'linear' }}
        >
          {move}
        </m.span>
      ))}
    </div>
  )
}
