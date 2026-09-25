'use client'

import { motion, useReducedMotion } from 'motion/react'
import { Bluetooth } from 'lucide-react'

export default function SmartCubeVisual() {
  const reduce = useReducedMotion()
  const moves = ['R', "U'", 'F2', "L'"]
  return (
    <div className="relative flex h-28 items-center justify-center overflow-hidden">
      {/* radar rings */}
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className="absolute rounded-full border border-[var(--cube-blue)]"
          style={{ width: 80, height: 80 }}
          animate={reduce ? undefined : { scale: [1, 1.9], opacity: [0.45, 0] }}
          transition={{ duration: 2.6, delay: i * 0.85, repeat: Infinity, ease: 'easeOut' }}
        />
      ))}

      {/* circular 3D cube preview (white frame clipped away) */}
      <span className="relative z-10 flex size-20 items-center justify-center rounded-full ring-1 ring-gray-900/10">
        <video
          src="/landing/cube3d.webm"
          autoPlay
          loop
          muted
          playsInline
          aria-hidden
          className="size-20 rounded-full object-cover"
        />
        {/* soft edge fade so the white recording blends into the card */}
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-full"
          style={{ boxShadow: 'inset 0 0 10px 6px #fff' }}
        />
        {/* bluetooth chip */}
        <span className="absolute -bottom-1 -right-1 z-20 flex size-6 items-center justify-center rounded-full bg-[var(--cube-blue)] shadow-md ring-2 ring-white">
          <Bluetooth className="size-3.5 text-white" />
        </span>
      </span>

      {moves.map((m, i) => (
        <motion.span
          key={i}
          className="absolute z-20 font-mono text-xs font-bold text-gray-900/70"
          style={{ left: `${10 + i * 24}%`, bottom: 4 }}
          animate={reduce ? { opacity: 0.5 } : { y: [6, -70], opacity: [0, 0.8, 0] }}
          transition={{ duration: 3, delay: i * 0.6, repeat: Infinity, ease: 'linear' }}
        >
          {m}
        </motion.span>
      ))}
    </div>
  )
}
