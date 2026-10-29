import { Fragment } from 'react'
import { getLocale, getTranslations } from 'next-intl/server'
import { cn } from '@/shared/lib/utils'
import { ALGORITHM_SETS } from '@/shared/const/algorithms-sets'
import { languages } from '@/shared/const/languages'
import { frameColumns } from '../lib/rails'
import LandingLanguageSelect from './LandingLanguageSelect'
import AboutBlock from './AboutBlock'
import FooterAnchor, { type FooterLink } from './FooterAnchor'

const REPO_URL = 'https://github.com/bryanlundberg/NexusTimer'
const FORUM_URL = 'https://www.speedsolving.com/threads/nexus-timer-all-in-one-cubing-platform.92975/'
const FEATURED_SETS = ['f2l', 'oll', 'pll', 'coll', 'zbls', 'oll-oh', 'cll', 'eg-1', 'pbl', 'parity-4x4']

export default async function FrameFooter() {
  const locale = await getLocale()
  const t = await getTranslations({ locale, namespace: 'LandingPage.footer' })
  const tPages = await getTranslations({ locale, namespace: 'Metadata.pages' })
  const tLanding = await getTranslations({ locale, namespace: 'LandingPage' })
  const tAbout = await getTranslations({ locale, namespace: 'LandingPage.about' })

  const columns: { title: string; links: FooterLink[] }[] = [
    {
      title: t('product'),
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
      title: t('algorithms'),
      links: FEATURED_SETS.flatMap((slug) => {
        const set = ALGORITHM_SETS.find((item) => item.slug === slug)
        return set ? [{ href: `/algorithms/${set.slug}`, label: set.title }] : []
      })
    },
    {
      title: t('language'),
      links: languages.map((language) => ({ href: '/', label: language.name, locale: language.code }))
    },
    {
      title: t('company'),
      links: [
        { href: '/about-us', label: t('about-us') },
        { href: '/contact-us', label: t('contact') },
        { href: REPO_URL, label: t('github'), external: true }
      ]
    },
    {
      title: t('community'),
      links: [
        { href: 'https://discord.gg/eCgTKcavec', label: t('discord'), external: true },
        { href: FORUM_URL, label: t('forum'), external: true },
        { href: `${REPO_URL}/issues/new?template=feature_request.yml`, label: t('feature-request'), external: true },
        { href: `${REPO_URL}/issues/new?template=bug_report.yml`, label: t('report-bug'), external: true },
        { href: `${REPO_URL}/blob/main/CONTRIBUTING.md`, label: t('contribute'), external: true }
      ]
    },
    {
      title: t('account'),
      links: [
        { href: '/sign-in', label: t('sign-in') },
        { href: '/sign-up', label: t('sign-up') },
        { href: '/options?redirect=import', label: tLanding('cta.secondary') }
      ]
    }
  ]

  const legal: FooterLink[] = [
    { href: '/privacy-policy', label: t('privacy') },
    { href: '/terms-of-service', label: t('terms') },
    { href: '/account-deletion', label: t('account-deletion') },
    { href: `${REPO_URL}/blob/main/LICENSE`, label: 'GPL-3.0', external: true }
  ]

  return (
    <footer className="relative mt-2 flex min-h-dvh flex-col">
      <div aria-hidden className="lp-rail-x-long absolute left-1/2 top-0 hidden w-[100dvw] -translate-x-1/2 md:block" />
      <div aria-hidden className="lp-rail-y pointer-events-none absolute inset-y-0 left-0 hidden md:block" />
      <div aria-hidden className="lp-rail-y pointer-events-none absolute inset-y-0 right-0 hidden md:block" />

      <div className={cn(frameColumns, 'flex-1')}>
        <div aria-hidden className="hidden md:block" />
        <div className="grid gap-x-8 gap-y-12 px-4 pb-16 pt-14 sm:grid-cols-2 md:grid-cols-3 md:px-0 xl:grid-cols-6">
          {columns.map((column) => (
            <div key={column.title}>
              <h3 className="mb-5 text-sm text-muted-foreground">{column.title}</h3>
              <ul className="space-y-3">
                {column.links.map((link) => (
                  <li key={`${link.href}-${link.locale ?? ''}`}>
                    <FooterAnchor
                      link={link}
                      className="text-base text-foreground transition-colors duration-200 hover:text-muted-foreground"
                    />
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div aria-hidden className="hidden md:block" />
      </div>

      <div className="relative">
        <div
          aria-hidden
          className="lp-rail-x-long absolute left-1/2 top-0 hidden w-[100dvw] -translate-x-1/2 md:block"
        />
        <div className="flex flex-col gap-4 border-t border-border px-4 py-6 md:flex-row md:items-center md:justify-between md:border-t-0 md:px-6 xl:px-10">
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">{t('copyright', { year: new Date().getFullYear() })}</span>
            <LandingLanguageSelect label={t('language')} />
          </div>
          <nav className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-muted-foreground">
            {legal.map((link, i) => (
              <Fragment key={link.href}>
                {i > 0 ? <span aria-hidden>|</span> : null}
                <FooterAnchor link={link} className="transition-colors duration-200 hover:text-foreground" />
              </Fragment>
            ))}
          </nav>
        </div>
      </div>

      <div className="relative">
        <div
          aria-hidden
          className="lp-rail-x-long absolute left-1/2 top-0 hidden w-[100dvw] -translate-x-1/2 md:block"
        />
        <div className="border-t border-border px-4 py-8 md:border-t-0 md:px-6 xl:px-10">
          <AboutBlock
            paragraphs={[tAbout('p1'), tAbout('p2'), tAbout('p3'), tAbout('p4')]}
            moreLabel={tAbout('more')}
            lessLabel={tAbout('less')}
          />
        </div>
      </div>
    </footer>
  )
}
