import Link from 'next/link'
import Image from 'next/image'
import { getLocale, getTranslations } from 'next-intl/server'

export default async function LandingFooter() {
  const locale = await getLocale()
  const t = await getTranslations({ locale, namespace: 'LandingPage.footer' })

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
              href={'https://play.google.com/store/apps/details?id=com.nexustimer'}
              target="_blank"
              rel="noreferrer"
            >
              <Image
                src="/landing/gp.avif"
                alt="Download Nexus Timer App"
                width={200}
                height={60}
                className="mt-6 -ms-4"
                unoptimized
              />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-8">
            <div>
              <h4 className="text-xs font-semibold text-gray-300 mb-6 uppercase tracking-[0.15em]">{t('product')}</h4>
              <ul className="space-y-3">
                {[
                  { href: '/app', label: t('timer-app') },
                  { href: '/stats', label: t('statistics') },
                  { href: '/free-play', label: t('multiplayer') },
                  { href: '/algorithms', label: t('algorithms') },
                  { href: '/leaderboards', label: t('leaderboards') }
                ].map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-gray-400 hover:text-white transition-colors duration-300"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-xs font-semibold text-gray-300 mb-6 uppercase tracking-[0.15em]">{t('company')}</h4>
              <ul className="space-y-3">
                <li>
                  <a
                    href="mailto:contact.nexustimer@gmail.com"
                    className="text-sm text-gray-400 hover:text-white transition-colors duration-300"
                  >
                    {t('contact')}
                  </a>
                </li>
                <li>
                  <Link
                    href="/privacy-policy"
                    className="text-sm text-gray-400 hover:text-white transition-colors duration-300"
                  >
                    {t('privacy')}
                  </Link>
                </li>
                <li>
                  <Link
                    href="/terms-of-service"
                    className="text-sm text-gray-400 hover:text-white transition-colors duration-300"
                  >
                    {t('terms')}
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-xs font-semibold text-gray-300 mb-6 uppercase tracking-[0.15em]">{t('community')}</h4>
              <ul className="space-y-3">
                <li>
                  <Link
                    href="https://discord.gg/eCgTKcavec"
                    target="_blank"
                    className="text-sm text-gray-400 hover:text-white transition-colors duration-300"
                  >
                    {t('discord')}
                  </Link>
                </li>
                <li>
                  <Link
                    href="https://github.com/NexusTimer"
                    target="_blank"
                    className="text-sm text-gray-400 hover:text-white transition-colors duration-300"
                  >
                    {t('github')}
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <span className="text-xs text-gray-400 italic">{t('disclaimer')}</span>
          <span className="text-xs text-gray-400">{t('copyright', { year: new Date().getFullYear() })}</span>
        </div>
      </div>
    </footer>
  )
}
