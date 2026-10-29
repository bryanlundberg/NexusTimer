'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import CornerHandles from './CornerHandles'
import FaqItem from './FaqItem'
import { FAQ_COUNT } from '../lib/faq'

export default function FaqSection() {
  const t = useTranslations('LandingPage.faq')
  const [open, setOpen] = useState(0)

  return (
    <section className="px-4 pt-20 md:px-0 md:pt-28">
      <h2 className="text-center font-[family-name:var(--font-space-grotesk)] text-balance text-4xl font-medium tracking-[-0.035em] md:text-6xl">
        {t('title')}
      </h2>

      <div className="relative mt-14 grid gap-px border border-border bg-border md:mt-20 md:border-x-0">
        <CornerHandles />
        {Array.from({ length: FAQ_COUNT }, (_, i) => (
          <FaqItem
            key={i}
            question={t(`q${i + 1}`)}
            answer={t(`a${i + 1}`)}
            open={open === i}
            onToggle={() => setOpen(open === i ? -1 : i)}
          />
        ))}
      </div>
    </section>
  )
}
