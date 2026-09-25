'use client'

import { motion } from 'motion/react'

export default function TestimonialsBackdrop({ reduce }: { reduce: boolean | null }) {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="absolute inset-0 bg-linear-to-b from-(--lp-bg) via-(--lp-bg-deep) to-(--lp-bg)" />

      <motion.svg
        className="absolute inset-[-12%] h-[124%] w-[124%] text-gray-900"
        xmlns="http://www.w3.org/2000/svg"
        animate={reduce ? undefined : { x: ['0px', '54px'], y: ['0px', '54px'] }}
        transition={{ duration: 22, repeat: Infinity, repeatType: 'reverse', ease: 'easeInOut' }}
      >
        <defs>
          <pattern id="tm-grid" width="54" height="54" patternUnits="userSpaceOnUse">
            <path d="M54 0H0V54" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.045" />
          </pattern>
          <pattern id="tm-dots" width="54" height="54" patternUnits="userSpaceOnUse">
            <circle cx="2" cy="2" r="1.1" fill="currentColor" opacity="0.04" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#tm-grid)" />
        <rect width="100%" height="100%" fill="url(#tm-dots)" />
      </motion.svg>

      {/* Slow floating brand-colour blobs for movement */}
      <motion.div
        className="absolute left-[6%] top-[16%] h-64 w-64 rounded-full blur-3xl"
        style={{ background: 'radial-gradient(circle, var(--cube-blue) 0%, transparent 70%)', opacity: 0.1 }}
        animate={reduce ? undefined : { x: [0, 40, 0], y: [0, -28, 0] }}
        transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute right-[8%] bottom-[14%] h-72 w-72 rounded-full blur-3xl"
        style={{ background: 'radial-gradient(circle, var(--cube-red) 0%, transparent 70%)', opacity: 0.1 }}
        animate={reduce ? undefined : { x: [0, -48, 0], y: [0, 30, 0] }}
        transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Edge fade so it blends back into the light sections above/below */}
      <div
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(to bottom, var(--lp-bg) 0%, transparent 14%, transparent 86%, var(--lp-bg) 100%)'
        }}
      />
    </div>
  )
}
