'use client'

import { useReducedMotion } from 'motion/react'
import { useTranslations } from 'next-intl'
import { Reveal } from '@/shared/ui/reveal/Reveal'
import TestimonialsBackdrop from './TestimonialsBackdrop'
import TestimonialQuote from './TestimonialQuote'

/**
 * Three real quotes, read in one screen. This used to be a 300vh scroll-pinned
 * carousel that showed one quote at a time; the pin cost three viewports of
 * scroll to deliver three sentences, so the quotes now sit side by side.
 */
export default function Testimonials() {
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
