import Image from 'next/image'
import { ArrowUpRight } from 'lucide-react'
import { Reveal } from '@/shared/ui/reveal/Reveal'
import { TEAM } from './content'

export default function TeamSection() {
  const { maintainer } = TEAM

  return (
    <section className="lp-cv relative px-6 py-20 md:py-28">
      <div className="mx-auto max-w-5xl">
        <Reveal className="mb-12 max-w-3xl">
          <p className="text-xs uppercase tracking-[0.3em] text-gray-500 mb-4">{TEAM.label}</p>
          <h2 className="font-display text-balance text-3xl md:text-5xl font-bold tracking-[-0.02em] text-gray-900">
            {TEAM.title}
          </h2>
        </Reveal>

        <Reveal className="grid gap-8 md:grid-cols-[200px_1fr] md:gap-12">
          <div className="flex items-center gap-4 md:flex-col md:items-start">
            <Image
              src={maintainer.avatar}
              alt={maintainer.name}
              width={160}
              height={160}
              unoptimized
              className="h-20 w-20 shrink-0 notch-br border border-gray-900/10 bg-gray-900/[0.04] object-cover md:h-40 md:w-40"
            />
            <div>
              <p className="font-semibold text-gray-900">{maintainer.name}</p>
              <p className="text-sm text-gray-500">{maintainer.role}</p>
              <a
                href={maintainer.github}
                target="_blank"
                rel="noreferrer"
                className="group mt-2 inline-flex items-center gap-1 text-sm text-gray-600 transition-colors duration-300 hover:text-gray-900"
              >
                @{maintainer.handle}
                <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </a>
            </div>
          </div>

          <div className="max-w-2xl space-y-4">
            {maintainer.paragraphs.map((paragraph) => (
              <p key={paragraph} className="text-base md:text-lg text-gray-600 leading-relaxed text-pretty">
                {paragraph}
              </p>
            ))}
          </div>
        </Reveal>

        <Reveal className="mt-16 border-t border-gray-900/10 pt-10">
          <div className="mb-6 flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
            <p className="flex items-center gap-2.5 text-sm font-medium text-primary">
              <span className="h-1.5 w-1.5 rounded-full bg-primary" />
              {TEAM.contributorsLabel}
              <span className="tabular-nums text-gray-500">{TEAM.contributors.length}</span>
            </p>
            <a
              href={TEAM.contributorsUrl}
              target="_blank"
              rel="noreferrer"
              className="group inline-flex items-center gap-1 text-sm text-gray-600 transition-colors duration-300 hover:text-gray-900"
            >
              {TEAM.contributorsLink}
              <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </a>
          </div>
          <p className="mb-8 max-w-2xl text-sm md:text-base text-gray-600 leading-relaxed text-pretty">
            {TEAM.contributorsText}
          </p>
          <ul className="flex flex-wrap gap-2">
            {TEAM.contributors.map((login) => (
              <li key={login}>
                <a
                  href={`https://github.com/${login}`}
                  target="_blank"
                  rel="noreferrer"
                  title={login}
                  className="block outline-none transition-transform duration-300 hover:-translate-y-0.5 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                >
                  <Image
                    src={`https://github.com/${login}.png?size=96`}
                    alt={login}
                    width={44}
                    height={44}
                    unoptimized
                    className="h-11 w-11 rounded-full border border-gray-900/10 bg-gray-900/[0.04] object-cover"
                  />
                </a>
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  )
}
