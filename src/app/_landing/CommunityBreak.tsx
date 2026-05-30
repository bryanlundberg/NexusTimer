'use client'

import Image from 'next/image'
import { useRef } from 'react'
import { useTranslations } from 'next-intl'
import { motion, useScroll, useTransform, useReducedMotion } from 'motion/react'

export default function CommunityBreak({
  scrollContainer
}: {
  scrollContainer: React.RefObject<HTMLDivElement | null>
}) {
  const t = useTranslations('LandingPage')
  const reduce = useReducedMotion()
  const ref = useRef<HTMLElement>(null)

  const { scrollYProgress } = useScroll({
    target: ref,
    container: scrollContainer,
    offset: ['start end', 'end start']
  })

  // The hall photo drifts and eases up as it passes — a slow cinematic push-in.
  const imgY = useTransform(scrollYProgress, [0, 1], ['-8%', '8%'])
  const imgScale = useTransform(scrollYProgress, [0, 0.5, 1], [1.15, 1.06, 1.15])
  const textY = useTransform(scrollYProgress, [0.1, 0.6], [40, -20])

  return (
    <section ref={ref} className="relative">
      {/* Full-bleed immersive moment */}
      <div className="relative h-[88vh] min-h-[520px] w-full overflow-hidden">
        <motion.div style={reduce ? undefined : { y: imgY, scale: imgScale }} className="absolute inset-0">
          <Image
            src="/landing/4.png"
            alt="Speedcubers gathered around competition tables at a WCA event, cubes and timers spread across the table"
            fill
            sizes="100vw"
            className="object-cover object-center"
            priority={false}
          />
        </motion.div>

        {/* Legibility + mood: darken top and bottom, keep the middle alive */}
        <div
          aria-hidden
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(to bottom, oklch(0.16 0.012 265 / 0.82) 0%, oklch(0.16 0.012 265 / 0.25) 38%, oklch(0.16 0.012 265 / 0.45) 70%, var(--lp-bg) 100%)'
          }}
        />

        <div className="relative z-10 flex h-full items-center justify-center px-6">
          <motion.div style={reduce ? undefined : { y: textY }} className="max-w-3xl text-center">
            <motion.h2
              initial={reduce ? { opacity: 0 } : { opacity: 0, y: 24, filter: 'blur(8px)' }}
              whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              viewport={{ once: true, margin: '-15%' }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="text-balance text-4xl font-bold tracking-tight text-white sm:text-5xl md:text-6xl"
              style={{ letterSpacing: '-0.02em', textShadow: '0 2px 30px rgba(0,0,0,0.6)' }}
            >
              {t('community.headline')}
            </motion.h2>
            <motion.p
              initial={reduce ? { opacity: 0 } : { opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-15%' }}
              transition={{ duration: 0.6, delay: 0.15 }}
              className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-pretty text-gray-200 md:text-lg"
              style={{ textShadow: '0 1px 18px rgba(0,0,0,0.55)' }}
            >
              {t('community.sub')}
            </motion.p>
          </motion.div>
        </div>
      </div>

      {/* Two supporting snapshots — pinned to the dark floor beneath the hall */}
      <div className="relative -mt-16 pb-24 md:-mt-24 md:pb-32">
        <div className="mx-auto flex max-w-4xl flex-col items-center justify-center gap-6 px-6 sm:flex-row sm:items-end">
          <Snapshot
            src="/landing/5.png"
            alt="A cuber practicing alone at a desk at home, phone running the NexusTimer timer beside the cube"
            caption={t('community.cap-home')}
            rotate={-3}
            className="w-full sm:w-[58%]"
            aspect="aspect-[16/10]"
          />
          <Snapshot
            src="/landing/2.png"
            alt="Students laughing while solving cubes together at a table, phones showing solve times"
            caption={t('community.cap-friends')}
            rotate={3}
            className="w-2/3 sm:w-[38%]"
            aspect="aspect-[3/4]"
          />
        </div>
      </div>
    </section>
  )
}

function Snapshot({
  src,
  alt,
  caption,
  rotate,
  className,
  aspect
}: {
  src: string
  alt: string
  caption: string
  rotate: number
  className?: string
  aspect: string
}) {
  const reduce = useReducedMotion()
  return (
    <motion.figure
      initial={reduce ? { opacity: 0 } : { opacity: 0, y: 30, rotate: rotate * 1.8 }}
      whileInView={{ opacity: 1, y: 0, rotate }}
      viewport={{ once: true, margin: '-10%' }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      whileHover={reduce ? undefined : { rotate: 0, y: -6, scale: 1.02 }}
      className={className}
      style={{ transformOrigin: 'center' }}
    >
      <div className="rounded-xl bg-white/90 p-2 shadow-[0_24px_60px_-24px_rgba(0,0,0,0.8)] ring-1 ring-white/10">
        <div className={`relative ${aspect} w-full overflow-hidden rounded-lg`}>
          <Image src={src} alt={alt} fill sizes="(max-width: 640px) 90vw, 40vw" className="object-cover" />
        </div>
        <figcaption className="px-1 pt-2 pb-0.5 text-center font-mono text-[11px] font-medium tracking-wide text-gray-700">
          {caption}
        </figcaption>
      </div>
    </motion.figure>
  )
}
