import { ArrowUpRight } from 'lucide-react'
import { Reveal } from '@/shared/ui/reveal/Reveal'
import { LIBRARIES, LIBRARIES_SECTION } from './content'

export default function LibrariesSection() {
  return (
    <section className="lp-cv relative overflow-hidden px-6 py-20 md:py-28">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-linear-to-b from-transparent via-(--lp-bg-deep) to-transparent"
      />
      <div className="mx-auto max-w-5xl">
        <Reveal className="mb-12 max-w-3xl">
          <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground mb-4">{LIBRARIES_SECTION.label}</p>
          <h2 className="font-display text-balance text-3xl md:text-5xl font-bold tracking-[-0.02em] text-foreground mb-6">
            {LIBRARIES_SECTION.title}
          </h2>
          <p className="text-base md:text-lg text-muted-foreground leading-relaxed text-pretty">
            {LIBRARIES_SECTION.text}
          </p>
        </Reveal>

        <ul className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {LIBRARIES.map((library, i) => (
            <li key={library.name}>
              <Reveal delay={i * 0.06} className="h-full">
                <a
                  href={library.href}
                  target="_blank"
                  rel="noreferrer"
                  className="surface group flex h-full flex-col p-6"
                >
                  <div className="mb-3 flex items-start justify-between gap-3">
                    <h3 className="font-mono text-sm font-semibold text-foreground">{library.name}</h3>
                    <ArrowUpRight className="h-4 w-4 shrink-0 text-muted-foreground/70 transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-foreground" />
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed text-pretty">{library.text}</p>
                  <div className="mt-auto flex flex-wrap gap-2 pt-5">
                    {library.tags.map((tag) => (
                      <span
                        key={tag}
                        className="border border-border px-2 py-0.5 text-[11px] font-medium text-muted-foreground"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </a>
              </Reveal>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
