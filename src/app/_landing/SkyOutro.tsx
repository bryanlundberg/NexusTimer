'use client'

import type { ReactNode } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight } from 'lucide-react'
import { useRef } from 'react'
import { useTranslations } from 'next-intl'
import { motion, useScroll, useTransform, useReducedMotion } from 'motion/react'

function CloudShape({ className }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={className}
      style={{
        filter: 'blur(2px)',
        background: [
          'radial-gradient(38% 60% at 30% 70%, oklch(0.20 0.018 264) 0%, transparent 72%)',
          'radial-gradient(30% 70% at 50% 55%, oklch(0.22 0.022 264) 0%, transparent 72%)',
          'radial-gradient(34% 64% at 68% 68%, oklch(0.18 0.016 264) 0%, transparent 72%)',
          'radial-gradient(22% 48% at 84% 76%, oklch(0.16 0.012 264) 0%, transparent 74%)',
          'radial-gradient(22% 50% at 16% 78%, oklch(0.16 0.012 264) 0%, transparent 74%)'
        ].join(',')
      }}
    />
  )
}

function FloatingStickers({ reduce }: { reduce: boolean | null }) {
  const stickers = [
    { c: 'var(--cube-red)', cls: 'left-[5%] top-[16%] h-8 w-8', dur: 6, delay: 0 },
    { c: 'var(--cube-blue)', cls: 'right-[7%] top-[22%] h-10 w-10', dur: 7, delay: 0.6 },
    { c: 'var(--cube-green)', cls: 'left-[10%] bottom-[18%] h-6 w-6', dur: 8, delay: 1.2 },
    { c: 'var(--cube-yellow)', cls: 'right-[11%] bottom-[22%] h-9 w-9', dur: 6.5, delay: 0.3 },
    { c: 'var(--cube-orange)', cls: 'left-[3%] top-[50%] h-5 w-5', dur: 7.5, delay: 0.9 }
  ]
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      {stickers.map((s, i) => (
        <motion.span
          key={i}
          className={`absolute hidden rounded-[7px] shadow-lg sm:block ${s.cls}`}
          style={{ backgroundColor: s.c, opacity: 0.85 }}
          animate={reduce ? undefined : { y: [0, -14, 0], rotate: [0, 10, 0] }}
          transition={{ duration: s.dur, repeat: Infinity, ease: 'easeInOut', delay: s.delay }}
        />
      ))}
    </div>
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
    <section
      ref={ref}
      className="relative isolate overflow-hidden"
      style={{ '--primary': 'oklch(0.65 0.28 264)', '--primary-foreground': 'oklch(0.97 0 0)' } as React.CSSProperties}
    >
      <div
        aria-hidden
        style={{
          background:
            'linear-gradient(to bottom, oklch(0.10 0.008 264) 0%, oklch(0.09 0.006 264) 20%, oklch(0.07 0.004 264) 50%, oklch(0.05 0.002 264) 80%, oklch(0.04 0 0) 100%)'
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
        <CloudShape className="absolute inset-0" />
      </motion.div>
      <motion.div style={right} className="pointer-events-none absolute bottom-0 right-0 -z-10 h-[55%] w-[75%]">
        <CloudShape className="absolute inset-0" />
      </motion.div>
      <motion.div style={floor} className="pointer-events-none absolute bottom-0 left-0 right-0 -z-10 h-[40%]">
        <CloudShape className="absolute inset-0 scale-x-150" />
      </motion.div>

      <div className="relative z-10 pt-[18vh] pb-24 md:pb-40">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="mx-auto max-w-4xl px-6"
        >
          <div className="relative overflow-hidden notch-bl-tr [--nblt:30px] border border-white/10 shadow-[0_40px_120px_-40px_rgba(50,100,255,0.50)] ring-1 ring-white/5">
            <div
              className="relative backdrop-blur-md rounded-none px-7 py-14 md:p-20 text-center"
              style={{ backgroundColor: 'color-mix(in oklch, oklch(0.10 0.020 264) 65%, transparent)' }}
            >
              <div
                aria-hidden
                className="pointer-events-none absolute -top-1/3 left-1/2 h-[420px] w-[680px] -translate-x-1/2 rounded-full blur-3xl"
                style={{
                  background: 'radial-gradient(ellipse at center, var(--primary) 0%, transparent 65%)',
                  opacity: 0.22
                }}
              />

              <FloatingStickers reduce={reduce} />

              <div className="relative z-10">
                <motion.h3
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  className="font-display text-balance text-4xl md:text-5xl lg:text-6xl font-bold tracking-[-0.02em] bg-gradient-to-b from-white to-white/60 bg-clip-text text-transparent mb-5"
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
                    className="group relative inline-flex items-center justify-center gap-2.5 overflow-hidden notch-bl-tr [--nblt:12px] bg-white text-gray-900 font-semibold px-8 py-4 text-sm transition-all duration-300 hover:shadow-[0_12px_44px_-10px_var(--primary)]"
                  >
                    <span
                      aria-hidden
                      className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-black/5 to-transparent transition-transform duration-700 ease-out group-hover:translate-x-full"
                    />
                    <Image
                      src="/landing/cube.gif"
                      alt=""
                      width={22}
                      height={22}
                      unoptimized
                      style={{ width: 22, height: 22 }}
                      className="relative transition-transform duration-300 group-hover:rotate-[18deg]"
                    />
                    <span className="relative">{t('cta.primary')}</span>
                    <ArrowRight className="relative h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                  </Link>
                  <Link
                    href="/options?redirect=import"
                    className="group inline-flex items-center justify-center notch-tl-br [--ntlbr:12px] border border-white/20 bg-white/5 px-7 py-4 text-sm font-medium text-gray-200 transition-all duration-300 hover:border-white/40 hover:bg-white/10 hover:text-white"
                  >
                    {t('cta.secondary')}
                  </Link>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.6 }}
                  className="mt-10 flex items-center justify-center gap-3 text-xs text-gray-400"
                >
                  <div className="flex -space-x-2">
                    {[1, 2, 7].map((num) => (
                      <Image
                        key={num}
                        className="inline-block h-7 w-7 rounded-full border-2 border-white/15 shadow-lg"
                        src={`https://cdn.jsdelivr.net/gh/alohe/avatars/png/vibrent_${num}.png`}
                        alt="Community member"
                        width={28}
                        height={28}
                        loading="lazy"
                      />
                    ))}
                  </div>
                  <span>{t('hero.social-proof')}</span>
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
