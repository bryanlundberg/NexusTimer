import { Link } from '@/shared/config/i18n/navigation'
import { getLocale, getTranslations } from 'next-intl/server'
import { Code2 } from 'lucide-react'
import { BrandMark } from '@/widgets/sidebar/ui/brand-mark'
import LandingLanguageSelect from './LandingLanguageSelect'

const REPO_URL = 'https://github.com/bryanlundberg/NexusTimer'
const FORUM_URL = 'https://www.speedsolving.com/threads/nexus-timer-all-in-one-cubing-platform.92975/'

interface FooterLink {
  href: string
  label: string
  external?: boolean
}

export default async function LandingFooter() {
  const locale = await getLocale()
  const t = await getTranslations({ locale, namespace: 'LandingPage.footer' })
  const tPages = await getTranslations({ locale, namespace: 'Metadata.pages' })

  const linkClass = 'text-sm text-muted-foreground transition-colors duration-300 hover:text-foreground'

  const columns: { title: string; accent: string; links: FooterLink[] }[] = [
    {
      title: t('product'),
      accent: 'var(--cube-blue)',
      links: [
        { href: '/app', label: tPages('timer.title') },
        { href: '/stats', label: t('statistics') },
        { href: '/cubes', label: t('cubes') },
        { href: '/free-play', label: t('multiplayer') },
        { href: '/algorithms', label: t('algorithms') },
        { href: '/algorithms/trainer', label: tPages('trainer.title') },
        { href: '/leaderboards', label: tPages('leaderboards.title') },
        { href: '/people', label: tPages('community.title') }
      ]
    },
    {
      title: t('company'),
      accent: 'var(--cube-green)',
      links: [
        { href: '/about-us', label: t('about-us') },
        { href: '/contact-us', label: t('contact') },
        { href: '/privacy-policy', label: t('privacy') },
        { href: '/terms-of-service', label: t('terms') },
        { href: '/account-deletion', label: t('account-deletion') },
        { href: REPO_URL, label: t('github'), external: true }
      ]
    },
    {
      title: t('community'),
      accent: 'var(--cube-orange)',
      links: [
        { href: 'https://discord.gg/eCgTKcavec', label: t('discord'), external: true },
        { href: FORUM_URL, label: t('forum'), external: true },
        {
          href: `${REPO_URL}/issues/new?template=feature_request.yml`,
          label: t('feature-request'),
          external: true
        },
        { href: `${REPO_URL}/issues/new?template=bug_report.yml`, label: t('report-bug'), external: true },
        { href: `${REPO_URL}/blob/main/CONTRIBUTING.md`, label: t('contribute'), external: true }
      ]
    }
  ]

  return (
    <footer className="dark w-full bg-transparent text-foreground">
      <div className="mx-auto max-w-7xl px-6 py-12">
        <div className="mb-12 grid grid-cols-1 gap-12 md:grid-cols-2">
          <div>
            <Link href="/" className="mb-6 inline-flex items-center gap-2">
              <BrandMark />
              <span className="font-brand text-base leading-tight font-bold tracking-tight">
                <span className="text-foreground">NEXUSTIMER</span>
                <span className="text-muted-foreground">.COM</span>
              </span>
            </Link>
            <p className="max-w-md text-sm leading-relaxed text-muted-foreground">{t('tagline')}</p>

            <a
              href={`${REPO_URL}/blob/main/LICENSE`}
              target="_blank"
              rel="noreferrer"
              className="mt-6 inline-flex items-center gap-2 text-xs text-muted-foreground transition-colors duration-300 hover:text-foreground"
            >
              <Code2 className="size-3.5" aria-hidden />
              GNU General Public License v3.0
            </a>
          </div>

          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
            {columns.map((column) => (
              <div key={column.title}>
                <h3 className="mb-6 flex items-center gap-2 font-display text-[10px] font-semibold uppercase tracking-[0.14em] text-foreground/55">
                  <span aria-hidden className="size-2 shrink-0" style={{ backgroundColor: column.accent }} />
                  <span className="truncate">{column.title}</span>
                  <span aria-hidden className="h-px min-w-4 flex-1 bg-border" />
                </h3>
                <ul className="space-y-3">
                  {column.links.map((link) => (
                    <li key={link.href}>
                      {link.external ? (
                        <a href={link.href} target="_blank" rel="noreferrer" className={linkClass}>
                          {link.label}
                        </a>
                      ) : (
                        <Link href={link.href} className={linkClass}>
                          {link.label}
                        </Link>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col items-center justify-between gap-6 border-t border-border pt-8 md:flex-row">
          <LandingLanguageSelect label={t('language')} />
          <span className="text-xs text-muted-foreground">{t('copyright', { year: new Date().getFullYear() })}</span>
        </div>
      </div>
    </footer>
  )
}
