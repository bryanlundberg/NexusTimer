'use client'

import Image from 'next/image'
import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { cn } from '@/shared/lib/utils'

const AVATARS = [9, 5, 4]

export default function TestimonialRotator() {
  const t = useTranslations('LandingPage.testimonials')
  const [active, setActive] = useState(0)

  const quotes = AVATARS.map((avatar, i) => ({
    avatar,
    text: t(`t${i}-text`),
    user: t(`t${i}-user`),
    role: t(`t${i}-role`)
  }))
  const current = quotes[active]

  return (
    <section className="px-4 pt-32 md:px-6 md:pt-44">
      <div className="mx-auto max-w-5xl">
        <h2 className="text-center font-[family-name:var(--font-space-grotesk)] text-balance text-4xl font-medium tracking-[-0.035em] md:text-6xl">
          {t('label')}
        </h2>

        <figure className="group mt-14 md:mt-20">
          <blockquote
            key={active}
            className="lp-rise min-h-[7.5em] font-[family-name:var(--font-space-grotesk)] text-pretty text-2xl font-medium leading-snug tracking-[-0.02em] text-foreground md:min-h-[5em] md:text-[2.5rem]"
          >
            &ldquo;{current.text}&rdquo;
          </blockquote>

          <div className="mt-10 grid gap-px border border-border bg-border sm:grid-cols-3">
            {quotes.map((quote, i) => (
              <button
                key={quote.user}
                type="button"
                onClick={() => setActive(i)}
                aria-pressed={i === active}
                className={cn(
                  'relative flex items-center gap-3 overflow-hidden bg-background p-4 text-left outline-none transition-colors focus-visible:bg-foreground/8 md:p-5',
                  i === active ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'
                )}
              >
                <Image
                  src={`https://cdn.jsdelivr.net/gh/alohe/avatars/png/vibrent_${quote.avatar}.png`}
                  alt=""
                  width={36}
                  height={36}
                  className={cn('size-9 rounded-full transition-opacity', i !== active && 'opacity-60')}
                />
                <span className="min-w-0">
                  <span className="block truncate text-sm font-medium">{quote.user}</span>
                  <span className="block truncate text-xs text-muted-foreground">{quote.role}</span>
                </span>
                {i === active ? (
                  <span
                    aria-hidden
                    onAnimationEnd={() => setActive((active + 1) % quotes.length)}
                    className="lp-progress absolute inset-x-0 bottom-0 h-0.5 origin-left bg-primary group-hover:[animation-play-state:paused]"
                  />
                ) : null}
              </button>
            ))}
          </div>
        </figure>
      </div>
    </section>
  )
}
