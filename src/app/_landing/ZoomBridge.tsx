'use client'

import { useRef } from 'react'
import { motion, useScroll, useTransform, useReducedMotion } from 'motion/react'

const CTA_TOP = 'oklch(0.10 0.008 264)'

export default function ZoomBridge({ scrollContainer }: { scrollContainer: React.RefObject<HTMLDivElement | null> }) {
  const ref = useRef<HTMLDivElement>(null)
  const reduce = useReducedMotion()

  const { scrollYProgress } = useScroll({
    target: ref,
    container: scrollContainer,
    offset: ['start start', 'end end']
  })

  const scale = useTransform(scrollYProgress, [0, 0.22, 0.6, 1], [1, 1, 3.6, 22])
  const inkOpacity = useTransform(scrollYProgress, [0.55, 0.9], [0, 1])

  if (reduce) {
    return (
      <div
        aria-hidden
        className="h-48"
        style={{ background: `linear-gradient(to bottom, var(--lp-bg) 0%, ${CTA_TOP} 100%)` }}
      />
    )
  }

  return (
    <section ref={ref} aria-hidden className="relative h-[200vh]">
      <div className="sticky top-0 flex h-screen items-center justify-center overflow-hidden bg-(--lp-bg)">
        {/* Ink flood — fades the light page into the CTA's black */}
        <motion.div style={{ opacity: inkOpacity, backgroundColor: CTA_TOP }} className="absolute inset-0 z-20" />

        {/* The question you fall into */}
        <motion.div
          style={{ scale, fontSize: 'clamp(2.75rem, 13vw, 11rem)', color: 'oklch(0.13 0.006 0)' }}
          className="relative z-10 select-none text-center font-black leading-[0.92] tracking-tighter will-change-transform"
        >
          <span className="block">ARE YOU</span>
          <span className="block">READY?</span>
        </motion.div>
      </div>
    </section>
  )
}
