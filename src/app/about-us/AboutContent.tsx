import Link from 'next/link'
import { ArrowLeft, ArrowRight, Code2, Gift, ShieldOff } from 'lucide-react'
import { Reveal } from '@/app/_landing/Reveal'
import { CubeGridTexture } from '@/app/_landing/CubeDecor'
import { Nexi } from '@/shared/ui/nexi'
import EraCarousel from './EraCarousel'
import { ABOUT, CTA, DISCORD_URL, ERAS, MISSION, REPO_URL } from './content'

const MISSION_ICONS = { gift: Gift, code: Code2, shield: ShieldOff } as const

export default function AboutContent() {
  return (
    <div className="lp-root min-h-dvh bg-[var(--lp-bg)] text-gray-900">
      <header className="mx-auto flex max-w-5xl items-center justify-between px-6 py-6">
        <Link href="/" className="flex items-center gap-3">
          <Nexi state="pb" size={34} />
          <span className="font-display text-md font-bold tracking-wide text-gray-900">NXTimer</span>
        </Link>
        <Link
          href="/"
          className="group inline-flex items-center gap-2 text-sm text-gray-600 transition-colors duration-300 hover:text-gray-900"
        >
          <ArrowLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-0.5" />
          {ABOUT.back}
        </Link>
      </header>

      <main>
        {/* Hero */}
        <section className="relative overflow-hidden px-6 pt-12 pb-20 md:pt-20 md:pb-28">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 -z-10 text-gray-900"
            style={{
              maskImage: 'radial-gradient(ellipse 70% 60% at 50% 30%, black 20%, transparent 75%)',
              WebkitMaskImage: 'radial-gradient(ellipse 70% 60% at 50% 30%, black 20%, transparent 75%)'
            }}
          >
            <CubeGridTexture opacity={0.06} />
          </div>

          <div className="mx-auto max-w-3xl text-center">
            <p className="lp-rise text-xs uppercase tracking-[0.3em] text-gray-500 mb-5">{ABOUT.label}</p>
            <h1
              className="lp-rise font-display text-balance text-3xl md:text-5xl lg:text-6xl font-bold tracking-[-0.02em] text-gray-900 mb-6"
              style={{ animationDelay: '0.1s' }}
            >
              {ABOUT.title}
            </h1>
            <p
              className="lp-rise text-base md:text-lg text-gray-600 leading-relaxed text-pretty"
              style={{ animationDelay: '0.18s' }}
            >
              {ABOUT.intro}
            </p>
          </div>
        </section>

        {/* Timeline */}
        <section className="lp-cv relative px-6 pb-8">
          <div className="mx-auto max-w-5xl">
            <Reveal className="flex items-center gap-2.5 mb-12 text-sm font-medium text-primary">
              <span className="h-1.5 w-1.5 rounded-full bg-primary" />
              {ABOUT.timelineLabel}
            </Reveal>

            <ol className="relative border-l border-gray-900/10 pl-6 md:pl-10">
              {ERAS.map((era, index) => (
                <li key={era.title} className="relative pb-16 last:pb-0">
                  <span
                    aria-hidden
                    className="absolute -left-[calc(1.5rem+5px)] top-2 h-2.5 w-2.5 rounded-[3px] md:-left-[calc(2.5rem+5px)]"
                    style={{ backgroundColor: era.accent }}
                  />

                  <Reveal className={era.images.length > 0 ? 'grid gap-8 md:grid-cols-2 md:items-center' : 'max-w-2xl'}>
                    <div>
                      <div className="mb-3 flex items-baseline gap-3">
                        <span className="font-display text-3xl md:text-4xl font-bold tabular-nums text-gray-900">
                          {era.year}
                        </span>
                        <span className="text-xs uppercase tracking-[0.2em] text-gray-500">{era.date}</span>
                      </div>
                      <h2 className="font-display text-xl md:text-2xl font-bold tracking-[-0.01em] text-gray-900 mb-3">
                        {era.title}
                      </h2>
                      <p className="text-sm md:text-base text-gray-600 leading-relaxed text-pretty">{era.text}</p>
                    </div>

                    {era.images.length > 0 && (
                      <div className={index % 2 === 1 ? 'md:order-first' : undefined}>
                        <EraCarousel
                          images={era.images}
                          ratio={era.ratio}
                          label={`${era.year} ${era.title}`}
                          accent={era.accent}
                        />
                      </div>
                    )}
                  </Reveal>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* Mission */}
        <section className="lp-cv relative overflow-hidden px-6 py-20 md:py-28">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 -z-10 bg-linear-to-b from-transparent via-(--lp-bg-deep) to-transparent"
          />
          <div className="mx-auto max-w-5xl">
            <Reveal className="text-center mb-14">
              <p className="text-xs uppercase tracking-[0.3em] text-gray-500 mb-4">{MISSION.label}</p>
              <h2 className="font-display text-3xl md:text-5xl font-bold tracking-[-0.02em] text-gray-900">
                {MISSION.title}
              </h2>
            </Reveal>

            <div className="grid gap-6 md:grid-cols-3">
              {MISSION.items.map((item, i) => {
                const Icon = MISSION_ICONS[item.icon]
                return (
                  <Reveal key={item.title} delay={i * 0.1}>
                    <div className="h-full notch-tl-br [--ntlbr:16px] border border-gray-900/10 bg-gray-900/[0.03] p-6">
                      <Icon className="h-5 w-5 text-primary mb-4" aria-hidden />
                      <h3 className="font-semibold text-gray-900 mb-2">{item.title}</h3>
                      <p className="text-sm text-gray-600 leading-relaxed text-pretty">{item.text}</p>
                    </div>
                  </Reveal>
                )
              })}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="relative px-6 pb-24">
          <div className="mx-auto max-w-3xl text-center">
            <Reveal>
              <h2 className="font-display text-2xl md:text-4xl font-bold tracking-[-0.02em] text-gray-900 mb-4">
                {CTA.title}
              </h2>
              <p className="text-gray-600 text-base mb-10 text-pretty">{CTA.text}</p>

              <div className="flex flex-wrap items-center justify-center gap-4">
                <Link
                  href="/app"
                  className="group relative inline-flex items-center justify-center gap-2 overflow-hidden notch-bl-tr [--nblt:12px] bg-gray-900 px-7 py-3.5 text-sm font-semibold text-white transition-colors duration-300 hover:bg-gray-700"
                >
                  {CTA.app}
                  <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                </Link>
                <Link
                  href={DISCORD_URL}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center justify-center notch-tl-br [--ntlbr:12px] border border-gray-900/15 px-6 py-3.5 text-sm font-medium text-gray-700 transition-colors duration-300 hover:border-gray-900/40 hover:text-gray-900"
                >
                  {CTA.discord}
                </Link>
                <Link
                  href={REPO_URL}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center justify-center notch-tl-br [--ntlbr:12px] border border-gray-900/15 px-6 py-3.5 text-sm font-medium text-gray-700 transition-colors duration-300 hover:border-gray-900/40 hover:text-gray-900"
                >
                  {CTA.github}
                </Link>
              </div>
            </Reveal>
          </div>
        </section>
      </main>
    </div>
  )
}
