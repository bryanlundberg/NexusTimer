'use client'

import { motion, useReducedMotion } from 'motion/react'
import { cn } from '@/shared/lib/utils'

export const SCRAMBLES = [
  "R U R' U' F2 D' L2 B R' D2 F' U L",
  "F R U' R' U' R U R' F' R U R' U'",
  "D2 L' B2 U F' R2 D' B L U2 R' F2",
  "B' U2 L F' D R2 U' B2 L' F U D2",
  "L2 D' R U2 F B' D2 L U' R2 F' B2",
  "U R2 F B R B2 R U2 L B2 R U' D'",
  "R' F2 B' D2 L' U2 R F' D B2 U' L2"
]

export function ScrambleTexture({ className, opacity = 0.05 }: { className?: string; opacity?: number }) {
  return (
    <svg aria-hidden className={cn('pointer-events-none absolute inset-0 h-full w-full', className)}>
      <defs>
        <pattern id="lp-scramble" width="460" height="168" patternUnits="userSpaceOnUse" patternTransform="rotate(-4)">
          {SCRAMBLES.slice(0, 6).map((s, i) => (
            <text
              key={i}
              x={(i % 2) * -90}
              y={22 + i * 26}
              fill="currentColor"
              opacity={opacity}
              style={{ fontFamily: 'var(--font-mono, ui-monospace, monospace)', fontSize: 13, letterSpacing: 2 }}
            >
              {s}
            </text>
          ))}
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#lp-scramble)" />
    </svg>
  )
}

export function CubeGridTexture({ className, opacity = 0.05 }: { className?: string; opacity?: number }) {
  return (
    <svg aria-hidden className={cn('pointer-events-none absolute inset-0 h-full w-full', className)}>
      <defs>
        <pattern id="lp-isocube" width="112" height="128" patternUnits="userSpaceOnUse">
          {/* full iso cube with 3x3 face hints */}
          <g stroke="currentColor" strokeWidth="1" fill="none" opacity={opacity} transform="translate(28,26)">
            <path d="M0 14 28 0l28 14-28 14z" />
            <path d="M0 14v28l28 14V28z" />
            <path d="M56 14v28L28 56V28z" />
            {/* sticker seams */}
            <path d="M9.33 9.33 37.33 23.33M18.66 4.66 46.66 18.66M9.33 23.33l28 14M18.66 18.66l28 14" opacity="0.6" />
            <path d="M0 23.33 28 37.33M0 32.66l28 14M56 23.33l-28 14M56 32.66l-28 14" opacity="0.6" />
            <path d="M9.33 18.66v28M18.66 23.33v28M46.66 23.33v28M37.33 18.66v28" opacity="0.6" />
          </g>
          {/* a lone offset cube, smaller, for rhythm */}
          <g
            stroke="currentColor"
            strokeWidth="1"
            fill="none"
            opacity={opacity * 0.7}
            transform="translate(84,92) scale(0.42)"
          >
            <path d="M0 14 28 0l28 14-28 14z" />
            <path d="M0 14v28l28 14V28z" />
            <path d="M56 14v28L28 56V28z" />
          </g>
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#lp-isocube)" />
    </svg>
  )
}

export function GrainTexture({ className, opacity = 0.035 }: { className?: string; opacity?: number }) {
  return (
    <svg
      aria-hidden
      className={cn('pointer-events-none absolute inset-0 h-full w-full', className)}
      style={{ opacity }}
    >
      <filter id="lp-grain">
        <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" stitchTiles="stitch" />
        <feColorMatrix type="saturate" values="0" />
      </filter>
      <rect width="100%" height="100%" filter="url(#lp-grain)" />
    </svg>
  )
}

const STICKER_COLORS = [
  'var(--cube-red)',
  'var(--cube-blue)',
  'var(--cube-green)',
  'var(--cube-orange)',
  'var(--cube-yellow)'
]

const STICKER_SPOTS = [
  { left: '7%', top: '18%', size: 14, rotate: 14, dur: 9, delay: 0 },
  { left: '13%', top: '68%', size: 10, rotate: -18, dur: 11, delay: 1.2 },
  { left: '88%', top: '24%', size: 12, rotate: 22, dur: 10, delay: 0.6 },
  { left: '82%', top: '72%', size: 16, rotate: -10, dur: 12, delay: 2 },
  { left: '24%', top: '38%', size: 8, rotate: 30, dur: 8, delay: 0.3 },
  { left: '74%', top: '46%', size: 9, rotate: -26, dur: 9.5, delay: 1.6 },
  { left: '46%', top: '14%', size: 10, rotate: 8, dur: 10.5, delay: 0.9 },
  { left: '58%', top: '82%', size: 12, rotate: -14, dur: 11.5, delay: 2.4 }
]

export function FloatingStickers({
  className,
  count = 8,
  opacity = 0.5
}: {
  className?: string
  count?: number
  opacity?: number
}) {
  const reduce = useReducedMotion()
  return (
    <div aria-hidden className={cn('pointer-events-none absolute inset-0 overflow-hidden', className)}>
      {STICKER_SPOTS.slice(0, count).map((s, i) => (
        <motion.span
          key={i}
          className="absolute rounded-[3px]"
          style={{
            left: s.left,
            top: s.top,
            width: s.size,
            height: s.size,
            backgroundColor: STICKER_COLORS[i % STICKER_COLORS.length],
            opacity,
            rotate: s.rotate,
            boxShadow: 'inset 0 0 0 1px rgba(0,0,0,0.08)'
          }}
          animate={reduce ? undefined : { y: [0, -14, 0], rotate: [s.rotate, s.rotate + 12, s.rotate] }}
          transition={{ duration: s.dur, delay: s.delay, repeat: Infinity, ease: 'easeInOut' }}
        />
      ))}
    </div>
  )
}
