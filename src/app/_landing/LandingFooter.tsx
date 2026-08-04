import Link from 'next/link'
import Image from 'next/image'
import { getLocale, getTranslations } from 'next-intl/server'
import { Code2 } from 'lucide-react'
import LandingLanguageSelect from './LandingLanguageSelect'

const REPO_URL = 'https://github.com/bryanlundberg/NexusTimer'
const FORUM_URL = 'https://www.speedsolving.com/threads/nexus-timer-all-in-one-cubing-platform.92975/'

export default async function LandingFooter() {
  const locale = await getLocale()
  const t = await getTranslations({ locale, namespace: 'LandingPage.footer' })

  const linkClass = 'text-sm text-gray-400 hover:text-white transition-colors duration-300'

  const productLinks = [
    { href: '/app', label: t('timer-app') },
    { href: '/stats', label: t('statistics') },
    { href: '/cubes', label: t('cubes') },
    { href: '/free-play', label: t('multiplayer') },
    { href: '/algorithms', label: t('algorithms') },
    { href: '/algorithms/trainer', label: t('trainer') },
    { href: '/leaderboards', label: t('leaderboards') },
    { href: '/people', label: t('people') }
  ]

  const companyLinks = [
    { href: 'mailto:contact.nexustimer@gmail.com', label: t('contact'), external: true },
    { href: '/privacy-policy', label: t('privacy') },
    { href: '/terms-of-service', label: t('terms') },
    { href: '/account-deletion', label: t('account-deletion') },
    { href: REPO_URL, label: t('github'), external: true }
  ]

  const communityLinks = [
    { href: 'https://discord.gg/eCgTKcavec', label: t('discord') },
    { href: FORUM_URL, label: t('forum') },
    { href: `${REPO_URL}/issues/new?template=feature_request.yml`, label: t('feature-request') },
    { href: `${REPO_URL}/issues/new?template=bug_report.yml`, label: t('report-bug') },
    { href: `${REPO_URL}/blob/main/CONTRIBUTING.md`, label: t('contribute') }
  ]

  return (
    <footer className="w-full bg-transparent">
      <div className="mx-auto max-w-7xl px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-12">
          <div className="col-span-1">
            <div className="flex items-center gap-3 mb-6">
              <Image src="/logo_white.png" alt="NexusTimer Logo" width={32} height={32} />
              <span className="font-display text-xl font-bold text-white">NexusTimer</span>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed max-w-md">{t('tagline')}</p>

            <Link
              href={`${REPO_URL}/blob/main/LICENSE`}
              target="_blank"
              rel="noreferrer"
              className="mt-6 inline-flex items-center gap-2 py-1.5 text-xs font-medium text-gray-300 transition-colors duration-300 hover:border-white/30 hover:text-white"
            >
              <Code2 className="size-3.5" aria-hidden />
              <span className="text-gray-400">GNU General Public License v3.0</span>
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-8">
            <div>
              <h4 className="text-xs font-semibold text-gray-300 mb-6 uppercase tracking-[0.15em]">{t('product')}</h4>
              <ul className="space-y-3">
                {productLinks.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className={linkClass}>
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-xs font-semibold text-gray-300 mb-6 uppercase tracking-[0.15em]">{t('company')}</h4>
              <ul className="space-y-3">
                {companyLinks.map((link) => (
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

            <div>
              <h4 className="text-xs font-semibold text-gray-300 mb-6 uppercase tracking-[0.15em]">{t('community')}</h4>
              <ul className="space-y-3">
                {communityLinks.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} target="_blank" rel="noreferrer" className={linkClass}>
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <LandingLanguageSelect label={t('language')} />
          </div>
          <span className="text-xs text-gray-400">{t('copyright', { year: new Date().getFullYear() })}</span>
        </div>
      </div>
    </footer>
  )
}
