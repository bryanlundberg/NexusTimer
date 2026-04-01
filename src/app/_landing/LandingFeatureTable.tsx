import Image from 'next/image'
import RatedIcon from '@/shared/ui/rate-icon/RateIcon'
import { getLocale, getTranslations } from 'next-intl/server'

export default async function LandingFeatureTable() {
  const locale = await getLocale()
  const t = await getTranslations({ locale, namespace: 'LandingPage.comparison' })

  const TABLES_DATA = [
    {
      title: t('core-title'),
      description: t('core-desc'),
      features: [
        {
          name: t('random-scrambles-name'),
          description: t('random-scrambles-desc'),
          nxTimer: 'check',
          csTimer: 'check',
          cubeDesk: 'check',
          twistyTimer: 'check'
        },
        {
          name: t('cross-platform-name'),
          description: t('cross-platform-desc'),
          nxTimer: 'check',
          csTimer: 'check',
          cubeDesk: 'check',
          twistyTimer: 'cross'
        },
        {
          name: t('import-timers-name'),
          description: t('import-timers-desc'),
          nxTimer: 'check',
          csTimer: 'cross',
          cubeDesk: 'partial',
          twistyTimer: 'cross'
        },
        {
          name: t('offline-name'),
          description: t('offline-desc'),
          nxTimer: 'check',
          csTimer: 'check',
          cubeDesk: 'cross',
          twistyTimer: 'check'
        },
        {
          name: t('stats-per-cube-name'),
          description: t('stats-per-cube-desc'),
          nxTimer: 'check',
          csTimer: 'cross',
          cubeDesk: 'cross',
          twistyTimer: 'cross'
        },
        {
          name: t('cloud-sync-name'),
          description: t('cloud-sync-desc'),
          nxTimer: 'check',
          csTimer: 'partial',
          cubeDesk: 'check',
          twistyTimer: 'cross'
        },
        {
          name: t('online-mode-name'),
          description: t('online-mode-desc'),
          nxTimer: 'check',
          csTimer: 'partial',
          cubeDesk: 'partial',
          twistyTimer: 'cross'
        }
      ]
    },
    {
      title: t('stats-title'),
      description: t('stats-section-desc'),
      features: [
        {
          name: t('global-stats-name'),
          description: t('global-stats-desc'),
          nxTimer: 'check',
          csTimer: 'cross',
          cubeDesk: 'check',
          twistyTimer: 'check'
        },
        {
          name: t('session-stats-name'),
          description: t('session-stats-desc'),
          nxTimer: 'check',
          csTimer: 'check',
          cubeDesk: 'check',
          twistyTimer: 'check'
        },
        {
          name: t('cube-stats-name'),
          description: t('cube-stats-desc'),
          nxTimer: 'check',
          csTimer: 'cross',
          cubeDesk: 'cross',
          twistyTimer: 'cross'
        },
        {
          name: t('performance-graphs-name'),
          description: t('performance-graphs-desc'),
          nxTimer: 'check',
          csTimer: 'check',
          cubeDesk: 'partial',
          twistyTimer: 'partial'
        }
      ]
    },
    {
      title: t('social-title'),
      description: t('social-desc'),
      features: [
        {
          name: t('profile-system-name'),
          description: t('profile-system-desc'),
          nxTimer: 'check',
          csTimer: 'cross',
          cubeDesk: 'check',
          twistyTimer: 'cross'
        },
        {
          name: t('compare-profiles-name'),
          description: t('compare-profiles-desc'),
          nxTimer: 'check',
          csTimer: 'cross',
          cubeDesk: 'cross',
          twistyTimer: 'cross'
        },
        {
          name: t('personal-bests-name'),
          description: t('personal-bests-desc'),
          nxTimer: 'check',
          csTimer: 'cross',
          cubeDesk: 'partial',
          twistyTimer: 'cross'
        },
        {
          name: t('cubes-owned-name'),
          description: t('cubes-owned-desc'),
          nxTimer: 'check',
          csTimer: 'cross',
          cubeDesk: 'cross',
          twistyTimer: 'cross'
        },
        {
          name: t('trajectory-name'),
          description: t('trajectory-desc'),
          nxTimer: 'check',
          csTimer: 'cross',
          cubeDesk: 'cross',
          twistyTimer: 'cross'
        }
      ]
    }
  ]

  return (
    <section className="relative py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-6">
        <div className="text-center mb-12">
          <p className="text-xs uppercase tracking-[0.3em] text-gray-400 mb-4">{t('label')}</p>
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-gray-900">{t('title')}</h2>
          <p className="text-sm md:text-base text-gray-500 mt-5">{t('subtitle')}</p>
        </div>

        <div>
          {TABLES_DATA.map((table, index) => (
            <table key={index} className="w-full table-auto border-collapse max-w-4xl mx-auto mb-2 last:mb-0">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="py-4 text-left text-gray-700 ps-4 w-full">
                    <div className="flex flex-col">
                      <p className="text-sm font-semibold">{table.title}</p>
                      <p className="text-xs font-normal text-gray-400">{table.description}</p>
                    </div>
                  </th>
                  <th className="py-4 text-gray-700 px-3">
                    <div className="flex flex-col items-center gap-1.5">
                      <Image
                        src="/logo.png"
                        alt="Nexus Timer logo"
                        width={64}
                        height={64}
                        className="size-5"
                        unoptimized
                      />
                      <span className="text-xs font-semibold text-gray-900">NXTimer</span>
                    </div>
                  </th>
                  <th className="py-4 text-xs text-gray-400 align-bottom px-3 font-medium">csTimer</th>
                  <th className="py-4 text-xs text-gray-400 align-bottom text-nowrap px-3 hidden md:table-cell font-medium">
                    Cube Desk
                  </th>
                  <th className="py-4 text-xs text-gray-400 align-bottom text-nowrap px-3 hidden md:table-cell font-medium">
                    Twisty Timer
                  </th>
                </tr>
              </thead>
              <tbody>
                {table.features.map((feature, fIndex) => (
                  <tr key={fIndex} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                    <td className="py-5 text-sm text-gray-700 ps-4">
                      <div className="font-medium">{feature.name}</div>
                      <div className="text-xs text-gray-400 mt-0.5">{feature.description}</div>
                    </td>
                    <td>
                      <RatedIcon type={feature.nxTimer as 'check' | 'cross' | 'partial'} />
                    </td>
                    <td>
                      <RatedIcon type={feature.csTimer as 'check' | 'cross' | 'partial'} />
                    </td>
                    <td className="hidden md:table-cell">
                      <RatedIcon type={feature.cubeDesk as 'check' | 'cross' | 'partial'} />
                    </td>
                    <td className="hidden md:table-cell">
                      <RatedIcon type={feature.twistyTimer as 'check' | 'cross' | 'partial'} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ))}
        </div>
      </div>
    </section>
  )
}
