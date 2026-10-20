import Image from 'next/image'
import { Link } from '@/shared/config/i18n/navigation'
import { ArrowLeft, ArrowRight, Code2, Gem, Gift, ShieldCheck } from 'lucide-react'
import { Reveal } from '@/shared/ui/reveal/Reveal'
import { CubeGridTexture } from '@/shared/ui/cube-grid-texture/CubeGridTexture'
import { BrandMark } from '@/widgets/sidebar/ui/brand-mark'
import TeamSection from './TeamSection'
import LibrariesSection from './LibrariesSection'
import GrowthSection from './GrowthSection'
import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/shared/lib/utils'
import { ABOUT, CTA, DISCORD_URL, MOTIVATION, ORIGIN, REPO_URL, STATS } from './content'

const MOTIVATION_ICONS = { code: Code2, gift: Gift, shield: ShieldCheck, quality: Gem } as const

export default function AboutContent() {
  return (
    <div className="lp-root min-h-dvh bg-background text-foreground">
      <header className="mx-auto flex max-w-5xl items-center justify-between px-6 py-6">
        <Link href="/" className="flex items-center gap-2">
          <BrandMark />
          <span className="font-brand text-base leading-tight font-bold tracking-tight">
            <span className="text-foreground">NEXUSTIMER</span>
            <span className="text-muted-foreground">.COM</span>
          </span>
        </Link>
        <Link
          href="/"
          className="group inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors duration-300 hover:text-foreground"
        >
          <ArrowLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-0.5" />
          {ABOUT.back}
        </Link>
      </header>

      <main>
        <section className="relative overflow-hidden px-6 pt-12 pb-16 md:pt-20 md:pb-24">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 -z-10 text-foreground"
            style={{
              maskImage: 'radial-gradient(ellipse 70% 60% at 50% 30%, black 20%, transparent 75%)',
              WebkitMaskImage: 'radial-gradient(ellipse 70% 60% at 50% 30%, black 20%, transparent 75%)'
            }}
          >
            <CubeGridTexture opacity={0.06} />
          </div>

          <div className="mx-auto max-w-3xl text-center">
            <p className="lp-rise text-xs uppercase tracking-[0.3em] text-muted-foreground mb-5">{ABOUT.label}</p>
            <h1
              className="lp-rise font-display text-balance text-3xl md:text-5xl lg:text-6xl font-bold tracking-[-0.02em] text-foreground mb-6"
              style={{ animationDelay: '0.1s' }}
            >
              {ABOUT.title}
            </h1>
            <p
              className="lp-rise text-base md:text-lg text-muted-foreground leading-relaxed text-pretty"
              style={{ animationDelay: '0.18s' }}
            >
              {ABOUT.intro}
            </p>
          </div>
        </section>

        <section className="px-6 pb-20 md:pb-28">
          <Reveal className="mx-auto grid max-w-5xl grid-cols-2 gap-px border border-border bg-foreground/10 md:grid-cols-4">
            {STATS.map((stat) => (
              <div key={stat.label} className="bg-background px-4 py-6 text-center md:py-8">
                <p className="font-display text-2xl md:text-4xl font-bold tracking-[-0.02em] text-foreground">
                  {stat.value}
                </p>
                <p className="mt-2 text-[11px] uppercase tracking-[0.2em] text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </Reveal>
        </section>

        <section className="lp-cv relative px-6 pb-20 md:pb-28">
          <Reveal className="mx-auto grid max-w-5xl gap-10 md:grid-cols-2 md:items-center md:gap-14">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground mb-4">{ORIGIN.label}</p>
              <h2 className="font-display text-balance text-3xl md:text-4xl font-bold tracking-[-0.02em] text-foreground mb-6">
                {ORIGIN.title}
              </h2>
              <div className="space-y-4">
                {ORIGIN.paragraphs.map((paragraph) => (
                  <p key={paragraph} className="text-sm md:text-base text-muted-foreground leading-relaxed text-pretty">
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>

            <div className="surface surface-panel overflow-hidden p-px">
              <Image
                src={ORIGIN.image.src}
                alt={ORIGIN.image.alt}
                width={ORIGIN.image.width}
                height={ORIGIN.image.height}
                sizes="(min-width: 768px) 50vw, 100vw"
                className="block h-auto w-full"
              />
            </div>
          </Reveal>
        </section>

        <section className="lp-cv relative overflow-hidden px-6 py-20 md:py-28">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 -z-10 bg-linear-to-b from-transparent via-(--lp-bg-deep) to-transparent"
          />
          <div className="mx-auto max-w-5xl">
            <Reveal className="mx-auto mb-14 max-w-3xl text-center">
              <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground mb-4">{MOTIVATION.label}</p>
              <h2 className="font-display text-balance text-3xl md:text-5xl font-bold tracking-[-0.02em] text-foreground mb-6">
                {MOTIVATION.title}
              </h2>
              <p className="text-base md:text-lg text-muted-foreground leading-relaxed text-pretty">
                {MOTIVATION.intro}
              </p>
            </Reveal>

            <div className="grid gap-6 md:grid-cols-2">
              {MOTIVATION.items.map((item, i) => {
                const Icon = MOTIVATION_ICONS[item.icon]
                return (
                  <Reveal key={item.title} delay={i * 0.1}>
                    <div className="surface surface-panel h-full p-6">
                      <Icon className="h-5 w-5 text-primary mb-4" aria-hidden />
                      <h3 className="font-semibold text-foreground mb-2">{item.title}</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed text-pretty">{item.text}</p>
                    </div>
                  </Reveal>
                )
              })}
            </div>
          </div>
        </section>

        <TeamSection />

        <LibrariesSection />

        <GrowthSection />

        <section className="relative px-6 pt-8 pb-24">
          <div className="mx-auto max-w-3xl text-center">
            <Reveal>
              <h2 className="font-display text-2xl md:text-4xl font-bold tracking-[-0.02em] text-foreground mb-4">
                {CTA.title}
              </h2>
              <p className="text-muted-foreground text-base mb-10 text-pretty">{CTA.text}</p>

              <div className="flex flex-wrap items-center justify-center gap-4">
                <Link href="/app" className={cn(buttonVariants({ size: 'lg' }), 'group')}>
                  {CTA.app}
                  <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                </Link>
                <Link
                  href={DISCORD_URL}
                  target="_blank"
                  rel="noreferrer"
                  className={buttonVariants({ variant: 'outline', size: 'lg' })}
                >
                  {CTA.discord}
                </Link>
                <Link
                  href={REPO_URL}
                  target="_blank"
                  rel="noreferrer"
                  className={buttonVariants({ variant: 'outline', size: 'lg' })}
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
