'use client'
import { ScrollArea } from '@/components/ui/scroll-area'
import Suggestions from '@/shared/ui/suggestions/suggestions'
import AlgorithmMethod from '@/features/algorithm-method/ui/AlgorithmMethod'
import SuggestAlgorithmButton from '@/features/suggest-algorithm/ui/SuggestAlgorithmButton'
import { ALGORITHM_SETS } from '@/shared/const/algorithms-sets'
import { useLocale, useTranslations } from 'next-intl'
import CoreHeader from '@/shared/ui/core-header/ui/CoreHeader'
import { PageBody } from '@/shared/ui/page-body/PageBody'
import { CubeGridTexture } from '@/app/_landing/CubeDecor'

const totalAlgorithms = ALGORITHM_SETS.reduce((sum, set) => sum + set.algorithms.length, 0)

export default function AlgorithmsMethodsPage() {
  const t = useTranslations('Index.AlgorithmsPage')
  const locale = useLocale()

  return (
    <ScrollArea className="max-h-dvh overflow-auto">
      <CoreHeader breadcrumbs={[{ label: t('title'), href: '/algorithms' }]} />

      <PageBody variant="data" className="px-4 pb-4 pt-4 md:px-8 md:pb-8 lg:px-12 lg:pb-12">
        <section className="relative overflow-hidden pt-8 pb-12 md:pt-12 md:pb-16">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 -z-10 text-foreground"
            style={{
              maskImage: 'radial-gradient(ellipse 70% 65% at 50% 35%, black 15%, transparent 75%)',
              WebkitMaskImage: 'radial-gradient(ellipse 70% 65% at 50% 35%, black 15%, transparent 75%)'
            }}
          >
            <CubeGridTexture opacity={0.07} />
          </div>

          <div className="mx-auto max-w-2xl text-center">
            <p className="lp-rise mb-5 text-xs uppercase tracking-[0.3em] text-muted-foreground">
              {ALGORITHM_SETS.length} sets · {totalAlgorithms.toLocaleString(locale)} algorithms
            </p>
            <h1
              className="lp-rise font-display text-3xl font-bold tracking-[-0.02em] text-balance md:text-5xl"
              style={{ animationDelay: '0.1s' }}
            >
              {t('title')}
            </h1>
            <p
              className="lp-rise mt-5 text-sm leading-relaxed text-muted-foreground text-pretty md:text-base"
              style={{ animationDelay: '0.18s' }}
            >
              {t('description')}
            </p>
          </div>
        </section>

        <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
          {ALGORITHM_SETS.map((set) => (
            <AlgorithmMethod key={set.slug} set={set} />
          ))}
        </div>

        <div className="flex flex-col items-center gap-1 sm:flex-row sm:justify-center sm:gap-6">
          <SuggestAlgorithmButton
            methods={ALGORITHM_SETS.map((set) => ({
              slug: set.slug,
              title: set.title,
              puzzle: set.puzzle,
              caseNames: set.algorithms.map((a) => a.name)
            }))}
          />
          <Suggestions message={t('edit-github')} />
        </div>
      </PageBody>
    </ScrollArea>
  )
}
