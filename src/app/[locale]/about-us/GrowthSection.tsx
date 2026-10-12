import { Reveal } from '@/shared/ui/reveal/Reveal'
import GrowthChart from './GrowthChart'
import { GROWTH } from './content'

export default function GrowthSection() {
  if (GROWTH.months.length === 0) return null

  return (
    <section className="lp-cv relative px-6 py-20 md:py-28">
      <div className="mx-auto max-w-5xl">
        <Reveal className="mb-10 max-w-3xl">
          <p className="text-xs uppercase tracking-[0.3em] text-gray-500 mb-4">{GROWTH.label}</p>
          <h2 className="font-display text-balance text-3xl md:text-5xl font-bold tracking-[-0.02em] text-gray-900 mb-6">
            {GROWTH.title}
          </h2>
          <p className="text-base md:text-lg text-gray-600 leading-relaxed text-pretty">{GROWTH.text}</p>
        </Reveal>

        <Reveal>
          <GrowthChart
            months={GROWTH.months}
            seriesLabel={GROWTH.seriesLabel}
            monthLabel={GROWTH.monthLabel}
            tableLabel={GROWTH.tableLabel}
          />
        </Reveal>
      </div>
    </section>
  )
}
