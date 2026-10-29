'use client'

import Image from 'next/image'
import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { Link } from '@/shared/config/i18n/navigation'
import { cn } from '@/shared/lib/utils'
import { REVIEWS } from '../lib/reviews'
import CornerHandles from './CornerHandles'

export default function TestimonialRotator() {
  const t = useTranslations('LandingPage.testimonials')
  const [active, setActive] = useState(0)
  const current = REVIEWS[active]

  return (
    <section className="px-4 pt-20 md:px-0 md:pt-28">
      <h2 className="text-center font-[family-name:var(--font-space-grotesk)] text-balance text-4xl font-medium tracking-[-0.035em] md:text-6xl">
        {t('label')}
      </h2>

      <figure className="group mt-14 md:mt-20">
        <div key={active} className="lp-rise mx-auto max-w-5xl md:px-10">
          <blockquote
            lang="en"
            className="min-h-[6em] font-[family-name:var(--font-space-grotesk)] text-pretty text-2xl font-medium leading-snug tracking-[-0.02em] text-foreground md:min-h-[4.5em] md:text-[2.5rem]"
          >
            &ldquo;{current.text}&rdquo;
          </blockquote>
          <figcaption className="mt-6 text-sm text-muted-foreground">
            <Link href={`/people/${current.userId}`} className="font-medium text-foreground hover:underline">
              {current.name}
            </Link>
            {current.bio ? <span lang="en"> · {current.bio}</span> : null}
          </figcaption>
        </div>

        <div className="relative mt-10 grid grid-cols-2 gap-px border border-border bg-border sm:grid-cols-4 md:border-x-0 xl:grid-cols-7">
          <CornerHandles />
          {REVIEWS.map((review, i) => (
            <button
              key={review.userId}
              type="button"
              onClick={() => setActive(i)}
              aria-pressed={i === active}
              aria-label={review.name}
              className={cn(
                'relative flex items-center gap-3 overflow-hidden bg-background p-4 text-left outline-none transition-colors focus-visible:bg-foreground/8 last:col-span-2 xl:flex-col xl:last:col-span-1 xl:items-start xl:gap-2.5',
                i === active ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'
              )}
            >
              <Image
                src={review.avatar}
                alt=""
                width={36}
                height={36}
                className={cn('size-9 shrink-0 rounded-full transition-opacity', i !== active && 'opacity-60')}
              />
              <span className="min-w-0 max-w-full">
                <span className="block truncate text-sm font-medium">{review.name}</span>
                <span lang="en" className="block truncate text-xs text-muted-foreground">
                  {review.bio || ' '}
                </span>
              </span>
              {i === active ? (
                <span
                  aria-hidden
                  onAnimationEnd={() => setActive((active + 1) % REVIEWS.length)}
                  className="lp-progress absolute inset-x-0 bottom-0 h-0.5 origin-left bg-primary group-hover:[animation-play-state:paused]"
                />
              ) : null}
            </button>
          ))}
        </div>
      </figure>
    </section>
  )
}
