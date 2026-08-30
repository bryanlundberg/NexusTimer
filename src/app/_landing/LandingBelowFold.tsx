'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Quote } from 'lucide-react'
import { cn } from '@/shared/lib/utils'
import { motion, useReducedMotion } from 'motion/react'
import { useTranslations } from 'next-intl'
import FeatureBento from './FeatureBento'
import { Reveal } from './Reveal'

function TestimonialsBackdrop({ reduce }: { reduce: boolean | null }) {
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

function TestimonialQuote({
  text,
  user,
  role,
  avatar,
  lead = false,
  delay = 0
}: {
  text: string
  user: string
  role: string
  avatar: number
  lead?: boolean
  delay?: number
}) {
  const reduce = useReducedMotion()

  return (
    <motion.figure
      initial={reduce ? { opacity: 0 } : { opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-8%' }}
      transition={{ duration: 0.55, delay, ease: [0.16, 1, 0.3, 1] }}
      className={cn(
        'flex h-full flex-col notch-tl-br [--ntlbr:18px] border border-gray-900/10 bg-white/55 backdrop-blur-sm',
        lead ? 'p-7 md:p-10' : 'p-6 md:p-7'
      )}
    >
      <Quote className={cn('text-gray-900/20', lead ? 'mb-5 h-7 w-7' : 'mb-4 h-5 w-5')} aria-hidden />
      <blockquote
        className={cn(
          'font-display font-medium tracking-[-0.01em] text-gray-900 text-pretty',
          lead ? 'text-xl leading-relaxed md:text-2xl lg:text-[1.75rem]' : 'text-base leading-relaxed'
        )}
      >
        {text}
      </blockquote>
      <figcaption className="mt-auto flex items-center gap-3 pt-7">
        <Image
          className={cn('rounded-full border-2 border-gray-900/10', lead ? 'h-11 w-11' : 'h-9 w-9')}
          src={`https://cdn.jsdelivr.net/gh/alohe/avatars/png/vibrent_${avatar}.png`}
          alt=""
          width={44}
          height={44}
        />
        <div className="min-w-0">
          <span className="block truncate text-sm font-semibold text-gray-900">{user}</span>
          <span className="block truncate text-xs text-gray-600">{role}</span>
        </div>
      </figcaption>
    </motion.figure>
  )
}

/**
 * Three real quotes, read in one screen. This used to be a 300vh scroll-pinned
 * carousel that showed one quote at a time; the pin cost three viewports of
 * scroll to deliver three sentences, so the quotes now sit side by side.
 */
function Testimonials() {
  const t = useTranslations('LandingPage')
  const reduce = useReducedMotion()

  const testimonials = [
    { text: t('testimonials.t0-text'), user: t('testimonials.t0-user'), avatar: 9, role: t('testimonials.t0-role') },
    { text: t('testimonials.t1-text'), user: t('testimonials.t1-user'), avatar: 5, role: t('testimonials.t1-role') },
    { text: t('testimonials.t2-text'), user: t('testimonials.t2-user'), avatar: 4, role: t('testimonials.t2-role') }
  ]

  const [lead, ...rest] = testimonials

  return (
    <section className="lp-cv relative overflow-hidden py-24 md:py-32">
      <TestimonialsBackdrop reduce={reduce} />

      <div className="relative z-10 mx-auto max-w-5xl px-6">
        <Reveal className="mb-10">
          <h2 className="font-display text-balance text-3xl font-bold tracking-[-0.02em] text-gray-900 md:text-4xl">
            {t('testimonials.label')}
          </h2>
        </Reveal>

        <div className="grid gap-5 md:grid-cols-5">
          <div className="md:col-span-3">
            <TestimonialQuote {...lead} lead />
          </div>
          <div className="flex flex-col gap-5 md:col-span-2">
            {rest.map((tm, i) => (
              <TestimonialQuote key={tm.user} {...tm} delay={0.08 + i * 0.08} />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

function CrossPlatformZoom() {
  const t = useTranslations('LandingPage')

  return (
    <section className="relative py-20 md:py-28 overflow-hidden">
      <div className="mx-auto max-w-7xl">
        <div className="mb-16 text-center px-6">
          <h2 className="font-display text-3xl md:text-5xl font-bold tracking-[-0.02em] text-gray-900 mb-5">
            {t('cross-platform.title')}
          </h2>
          <p className="text-gray-600 text-base max-w-xl mx-auto">{t('cross-platform.subtitle')}</p>
        </div>

        <div className="relative mx-auto w-full max-w-4xl px-6">
          <Reveal>
            <div className="relative overflow-hidden rounded-xl border border-gray-900/10 shadow-2xl shadow-black/10 ring-1 ring-gray-900/5">
              <div className="bg-neutral-900 h-8 flex items-center px-4 gap-2 border-b border-white/5">
                <div className="flex gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-[var(--cube-red)]" />
                  <div className="w-2.5 h-2.5 rounded-full bg-[var(--cube-yellow)]" />
                  <div className="w-2.5 h-2.5 rounded-full bg-[var(--cube-green)]" />
                </div>
                <div className="mx-auto rounded-md bg-neutral-100 px-16 py-0.5 text-[10px] text-gray-500">
                  nexustimer.com
                </div>
              </div>
              <Image
                src="/landing/desk1.webp"
                alt="NexusTimer desktop view"
                width={1200}
                height={750}
                className="w-full"
              />
            </div>
          </Reveal>

          <div className="absolute -right-2 md:-right-6 -bottom-6 md:-bottom-10 z-20 w-24 md:w-40 drop-shadow-2xl">
            <Image
              src="/landing/cellphone2.webp"
              alt="NexusTimer mobile view"
              width={300}
              height={600}
              className="w-full"
            />
          </div>
        </div>

        <Reveal delay={0.15} className="mt-16 md:mt-20 flex flex-col items-center gap-3 px-6 text-center">
          <p className="text-sm text-gray-500">{t('cross-platform.android-note')}</p>
          <Link
            href="https://play.google.com/store/apps/details?id=com.nexustimer"
            target="_blank"
            rel="noreferrer"
            aria-label={t('cross-platform.google-play')}
            className="inline-flex rounded-lg transition-transform duration-300 hover:scale-[1.04]"
          >
            <Image
              src="/landing/gp.avif"
              alt={t('cross-platform.google-play')}
              width={186}
              height={55}
              className="h-[52px] w-auto rounded-lg shadow-lg shadow-black/10"
              unoptimized
            />
          </Link>
        </Reveal>
      </div>
    </section>
  )
}

export default function LandingBelowFold() {
  return (
    <>
      <CrossPlatformZoom />

      <FeatureBento />

      <Testimonials />
    </>
  )
}
