'use client'

import Image from 'next/image'
import { useTranslations } from 'next-intl'
import { useReducedMotion } from 'motion/react'
import * as m from 'motion/react-m'
import { Link } from '@/shared/config/i18n/navigation'
import { cn } from '@/shared/lib/utils'
import { REVIEWS } from '../lib/reviews'
import CornerHandles from './CornerHandles'

export default function TestimonialRotator() {
  const t = useTranslations('LandingPage.testimonials')
  const reduce = useReducedMotion()

  return (
    <section className="px-4 pt-20 md:px-0 md:pt-28">
      <h2 className="text-center font-[family-name:var(--font-space-grotesk)] text-balance text-4xl font-medium tracking-[-0.035em] md:text-6xl">
        {t('label')}
      </h2>

      <div className="relative mt-14 grid gap-px border border-border bg-border md:mt-20 md:grid-cols-3 md:border-x-0">
        <CornerHandles />
        {REVIEWS.map((review, i) => (
          <m.figure
            key={review.userId}
            initial={reduce ? false : { opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.5, delay: (i % 2) * 0.1, ease: [0.16, 1, 0.3, 1] }}
            className={cn(
              'flex flex-col justify-between gap-8 bg-background p-6 md:p-8',
              review.wide && 'md:col-span-2'
            )}
          >
            <blockquote
              lang="en"
              className={cn(
                'font-[family-name:var(--font-space-grotesk)] text-pretty font-medium leading-snug tracking-[-0.02em] text-foreground',
                review.wide ? 'text-xl md:text-3xl' : 'text-lg md:text-2xl'
              )}
            >
              &ldquo;{review.text}&rdquo;
            </blockquote>
            <figcaption className="flex items-center gap-3">
              <Image
                src={review.avatar}
                alt=""
                width={36}
                height={36}
                className="size-9 shrink-0 border border-border"
              />
              <span className="min-w-0">
                <Link
                  href={`/people/${review.userId}`}
                  className="block truncate text-sm font-medium text-foreground hover:underline"
                >
                  {review.name}
                </Link>
                {review.bio ? (
                  <span lang="en" className="block truncate text-xs text-muted-foreground">
                    {review.bio}
                  </span>
                ) : null}
              </span>
            </figcaption>
          </m.figure>
        ))}
      </div>
    </section>
  )
}
