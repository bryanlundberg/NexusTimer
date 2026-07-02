'use client'

import { useRef } from 'react'
import { useTranslations } from 'next-intl'
import { motion, useScroll, useTransform, useReducedMotion } from 'motion/react'
import { ScrambleTexture } from './CubeDecor'

const LP_BG = 'oklch(0.97 0.004 26)'
const CTA_TOP = 'oklch(0.10 0.008 264)'

export default function ZoomBridge({ scrollContainer }: { scrollContainer: React.RefObject<HTMLDivElement | null> }) {
  const ref = useRef<HTMLDivElement>(null)
  const reduce = useReducedMotion()
  const t = useTranslations('LandingPage')

  const { scrollYProgress } = useScroll({
    target: ref,
    container: scrollContainer,
    offset: ['start start', 'end end']
  })

  const scale = useTransform(scrollYProgress, [0, 0.2, 0.6, 1], [1, 1, 4, 24])
  const stageBg = useTransform(scrollYProgress, [0.18, 0.46], [LP_BG, CTA_TOP])
  const textColor = useTransform(scrollYProgress, [0.28, 0.46], ['oklch(0.13 0.006 0)', CTA_TOP])
  const textureOpacity = useTransform(scrollYProgress, [0.18, 0.42], [1, 0])

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
    <section
      ref={ref}
      aria-hidden
      className="relative h-[280vh]"
      style={{
        background: `linear-gradient(to bottom, var(--lp-bg) 0%, var(--lp-bg) 18%, ${CTA_TOP} 32%, ${CTA_TOP} 100%)`
      }}
    >
      <motion.div
        style={{ backgroundColor: stageBg }}
        className="sticky top-0 flex h-screen items-center justify-center overflow-hidden"
      >
        {/* scramble wallpaper that dissolves as the stage goes dark */}
        <motion.div style={{ opacity: textureOpacity }} className="pointer-events-none absolute inset-0 text-gray-900">
          <ScrambleTexture opacity={0.05} />
        </motion.div>
        <motion.div
          style={{ scale, color: textColor, fontSize: 'clamp(2.75rem, 13vw, 11rem)' }}
          className="relative z-10 select-none text-center font-black leading-[0.92] tracking-tighter will-change-transform"
        >
          <span className="block">{t('zoom-cta.line1')}</span>
          <span className="block">{t('zoom-cta.line2')}</span>
        </motion.div>
      </motion.div>
    </section>
  )
}
