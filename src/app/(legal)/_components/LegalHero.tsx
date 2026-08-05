import { CubeGridTexture } from '@/app/_landing/CubeDecor'

interface LegalHeroProps {
  label: string
  title: string
  intro?: string
}

export default function LegalHero({ label, title, intro }: LegalHeroProps) {
  return (
    <section className="relative overflow-hidden pt-12 pb-14 md:pt-20 md:pb-16">
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
        <p className="lp-rise text-xs uppercase tracking-[0.3em] text-gray-500 mb-5">{label}</p>
        <h1
          className="lp-rise font-display text-balance text-3xl md:text-5xl font-bold tracking-[-0.02em] text-gray-900"
          style={{ animationDelay: '0.1s' }}
        >
          {title}
        </h1>
        {intro && (
          <p
            className="lp-rise mt-6 text-base md:text-lg text-gray-600 leading-relaxed text-pretty"
            style={{ animationDelay: '0.18s' }}
          >
            {intro}
          </p>
        )}
      </div>
    </section>
  )
}
