'use client'

import { useReducedMotion } from 'motion/react'
import * as m from 'motion/react-m'
import { WifiOff } from 'lucide-react'

export default function OfflineVisual() {
  const reduce = useReducedMotion()

  return (
    <div className="flex items-center justify-center py-6">
      <m.span
        className="inline-flex"
        initial={{ rotate: -6 }}
        animate={reduce ? { rotate: 0 } : { rotate: 6 }}
        transition={
          reduce ? { duration: 0 } : { duration: 2.8, ease: 'easeInOut', repeat: Infinity, repeatType: 'mirror' }
        }
      >
        <WifiOff className="size-20 text-[var(--cube-red)]" strokeWidth={1.5} aria-hidden />
      </m.span>
    </div>
  )
}
