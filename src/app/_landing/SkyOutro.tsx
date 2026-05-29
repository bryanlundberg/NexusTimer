'use client'

import type { ReactNode } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight } from 'lucide-react'
import { useRef } from 'react'
import { useTranslations } from 'next-intl'
import { motion, useScroll, useTransform, useReducedMotion } from 'motion/react'

function CloudShape({ className, drift = 0 }: { className?: string; drift?: number }) {
  const reduce = useReducedMotion()
  return (
    <motion.div
      aria-hidden
      className={className}
      animate={reduce || drift === 0 ? undefined : { x: [0, drift, 0] }}
      transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
      style={{
        filter: 'blur(2px)',
        background: [
          'radial-gradient(38% 60% at 30% 70%, oklch(0.22 0.06 264) 0%, transparent 72%)',
          'radial-gradient(30% 70% at 50% 55%, oklch(0.24 0.065 263) 0%, transparent 72%)',
          'radial-gradient(34% 64% at 68% 68%, oklch(0.2 0.06 265) 0%, transparent 72%)',
          'radial-gradient(22% 48% at 84% 76%, oklch(0.18 0.055 266) 0%, transparent 74%)',
          'radial-gradient(22% 50% at 16% 78%, oklch(0.18 0.055 266) 0%, transparent 74%)'
        ].join(',')
      }}
    />
  )
}

export default function SkyOutro({
  scrollContainerRef,
  children
}: {
  scrollContainerRef: React.RefObject<HTMLDivElement | null>
  children: ReactNode
}) {
  const t = useTranslations('LandingPage')
  const reduce = useReducedMotion()
  const ref = useRef<HTMLElement>(null)

  const { scrollYProgress } = useScroll({
    target: ref,
    container: scrollContainerRef,
    offset: ['start end', 'end end']
  })

  const leftX = useTransform(scrollYProgress, [0, 0.85], ['-55%', '0%'])
  const rightX = useTransform(scrollYProgress, [0, 0.85], ['55%', '0%'])
  const floorY = useTransform(scrollYProgress, [0, 0.85], ['60%', '0%'])
  const cloudsOpacity = useTransform(scrollYProgress, [0, 0.12, 0.85], [0, 0.4, 0.85])

  const left = reduce ? { x: '-18%', opacity: 0.7 } : { x: leftX, opacity: cloudsOpacity }
  const right = reduce ? { x: '18%', opacity: 0.7 } : { x: rightX, opacity: cloudsOpacity }
  const floor = reduce ? { y: '20%', opacity: 0.7 } : { y: floorY, opacity: cloudsOpacity }

  return (
    <section ref={ref} className="relative isolate overflow-hidden">
      <div
        aria-hidden
        style={{
          background:
            'linear-gradient(to bottom, #ffffff 0%, #ffffff 10%, oklch(0.96 0.006 258) 22%, oklch(0.86 0.014 260) 33%, oklch(0.7 0.026 261) 45%, oklch(0.52 0.036 263) 57%, oklch(0.34 0.04 264) 70%, oklch(0.18 0.03 265) 85%, oklch(0.08 0.02 266) 100%)'
        }}
        className="pointer-events-none absolute inset-0 -z-20"
      />

      <div
        aria-hidden
        style={{
          backgroundImage: [
            'radial-gradient(1.5px 1.5px at 12% 30%, rgba(255,255,255,0.9), transparent)',
            'radial-gradient(1px 1px at 28% 18%, rgba(255,255,255,0.7), transparent)',
            'radial-gradient(1.5px 1.5px at 44% 38%, rgba(255,255,255,0.8), transparent)',
            'radial-gradient(1px 1px at 62% 22%, rgba(255,255,255,0.6), transparent)',
            'radial-gradient(1.5px 1.5px at 76% 34%, rgba(255,255,255,0.85), transparent)',
            'radial-gradient(1px 1px at 88% 20%, rgba(255,255,255,0.7), transparent)',
            'radial-gradient(1px 1px at 18% 52%, rgba(255,255,255,0.6), transparent)',
            'radial-gradient(1.5px 1.5px at 54% 58%, rgba(255,255,255,0.7), transparent)',
            'radial-gradient(1px 1px at 82% 50%, rgba(255,255,255,0.6), transparent)'
          ].join(',')
        }}
        className="pointer-events-none absolute inset-0 -z-20"
      />

      <motion.div style={left} className="pointer-events-none absolute bottom-0 left-0 -z-10 h-[55%] w-[75%]">
        <CloudShape className="absolute inset-0" drift={10} />
      </motion.div>
      <motion.div style={right} className="pointer-events-none absolute bottom-0 right-0 -z-10 h-[55%] w-[75%]">
        <CloudShape className="absolute inset-0" drift={-10} />
      </motion.div>
      <motion.div style={floor} className="pointer-events-none absolute bottom-0 left-0 right-0 -z-10 h-[40%]">
        <CloudShape className="absolute inset-0 scale-x-150" drift={6} />
      </motion.div>

      <div className="relative z-10 pt-[40vh] pb-24 md:pb-40">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="mx-auto max-w-4xl px-6"
        >
          <div className="relative overflow-hidden rounded-[20px] border border-white/10 shadow-[0_40px_120px_-40px_rgba(59,108,246,0.5)] ring-1 ring-white/5">
            <div
              className="relative backdrop-blur-xl rounded-[20px] p-12 md:p-20 text-center"
              style={{ backgroundColor: 'color-mix(in oklch, oklch(0.14 0.03 265) 58%, transparent)' }}
            >
              <div
                aria-hidden
                className="pointer-events-none absolute -top-1/3 left-1/2 h-[420px] w-[680px] -translate-x-1/2 rounded-full blur-3xl"
                style={{
                  background: 'radial-gradient(ellipse at center, var(--primary) 0%, transparent 65%)',
                  opacity: 0.22
                }}
              />
              <div className="relative z-10">
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  whileInView={{ scale: 1, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white/10 border border-white/15 mb-8"
                >
                  <Image src="/landing/cube.gif" alt="" width={40} height={40} unoptimized />
                </motion.div>
                <motion.h3
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  className="text-balance text-3xl md:text-5xl lg:text-6xl font-bold text-white mb-5"
                >
                  {t('cta.title')}
                </motion.h3>
                <motion.p
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                  className="text-gray-300 text-base md:text-lg mb-10 max-w-md mx-auto text-pretty"
                >
                  {t('cta.subtitle')}
                </motion.p>
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.5 }}
                  className="flex flex-wrap items-center justify-center gap-4"
                >
                  <Link
                    href="/app"
                    className="group inline-flex items-center justify-center gap-2.5 rounded-full bg-white text-gray-900 font-semibold px-8 py-4 text-sm transition-all duration-300 hover:bg-gray-100 hover:scale-[1.03] hover:shadow-[0_8px_40px_-6px_var(--primary)]"
                  >
                    {t('cta.primary')}
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                  <Link
                    href="/options?redirect=import"
                    className="inline-flex items-center justify-center rounded-full border border-white/20 bg-white/5 px-7 py-4 text-sm text-gray-200 transition-all duration-300 hover:border-white/40 hover:bg-white/10 hover:text-white"
                  >
                    {t('cta.secondary')}
                  </Link>
                </motion.div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      <div className="relative z-10">{children}</div>
    </section>
  )
}
