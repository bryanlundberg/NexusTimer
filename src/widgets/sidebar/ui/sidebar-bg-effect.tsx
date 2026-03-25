'use client'

import { motion } from 'framer-motion'

export function SidebarBgEffect() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {/* Primary orb - strongest */}
      <motion.div
        className="absolute -top-16 -left-16 size-56 rounded-full bg-primary/20 blur-3xl dark:bg-primary/10"
        animate={{
          x: [0, 35, -15, 0],
          y: [0, 50, 25, 0],
          scale: [1, 1.25, 0.9, 1]
        }}
        transition={{
          duration: 16,
          repeat: Infinity,
          ease: 'easeInOut'
        }}
      />
      {/* Secondary orb - medium */}
      <motion.div
        className="absolute -right-12 top-1/3 size-48 rounded-full bg-primary/8 blur-3xl dark:bg-primary/1"
        animate={{
          x: [0, -25, 20, 0],
          y: [0, -35, 15, 0],
          scale: [1, 0.85, 1.2, 1]
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: 'easeInOut'
        }}
      />
      {/* Bottom orb - soft */}
      <motion.div
        className="absolute -bottom-12 left-1/4 size-44 rounded-full bg-primary/2 blur-3xl dark:bg-primary/1"
        animate={{
          x: [0, 30, -20, 0],
          y: [0, -25, 20, 0],
          scale: [1, 1.15, 0.85, 1]
        }}
        transition={{
          duration: 22,
          repeat: Infinity,
          ease: 'easeInOut'
        }}
      />
      {/* Mid orb - subtle */}
      <motion.div
        className="absolute top-2/3 -left-8 size-36 rounded-full bg-primary/2 blur-3xl dark:bg-primary/1"
        animate={{
          x: [0, 20, -10, 0],
          y: [0, -15, 25, 0],
          scale: [1, 1.1, 0.95, 1]
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: 'easeInOut'
        }}
      />
      {/* Top gradient */}
      <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-primary/2 to-transparent dark:from-primary/10" />
      {/* Bottom gradient */}
      <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-primary/5 to-transparent dark:from-primary/5" />
    </div>
  )
}
