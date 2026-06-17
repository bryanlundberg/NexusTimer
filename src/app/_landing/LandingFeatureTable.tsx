import Image from 'next/image'
import { Check } from 'lucide-react'
import { getLocale, getTranslations } from 'next-intl/server'

type Cell = 'check' | 'cross' | 'partial'

function Rate({ type }: { type: Cell }) {
  if (type === 'check') {
    return (
      <span className="mx-auto flex size-7 items-center justify-center rounded-full bg-[var(--cube-green)]/15">
        <Check className="size-4 text-[var(--cube-green)]" strokeWidth={2.5} />
      </span>
    )
  }
  if (type === 'partial') {
    return (
      <span className="mx-auto flex size-7 items-center justify-center rounded-full bg-[var(--cube-orange)]/15">
        <span className="size-1.5 rounded-full bg-[var(--cube-orange)]" />
      </span>
    )
  }
  return <span aria-hidden className="mx-auto block h-px w-3.5 rounded-full bg-gray-300" />
}

export default async function LandingFeatureTable() {
  const locale = await getLocale()
  const t = await getTranslations({ locale, namespace: 'LandingPage.comparison' })

  const TABLES_DATA = [
    {
      title: t('social-title'),
      description: t('social-desc'),
      accent: 'var(--cube-green)',
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
    },
    {
      title: t('stats-title'),
      description: t('stats-section-desc'),
      accent: 'var(--cube-blue)',
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
      title: t('core-title'),
      description: t('core-desc'),
      accent: 'var(--cube-red)',
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
        },
        {
          name: t('smart-cube-name'),
          description: t('smart-cube-desc'),
          nxTimer: 'check',
          csTimer: 'check',
          cubeDesk: 'check',
          twistyTimer: 'cross'
        },
        {
          name: t('algorithm-trainer-name'),
          description: t('algorithm-trainer-desc'),
          nxTimer: 'check',
          csTimer: 'cross',
          cubeDesk: 'check',
          twistyTimer: 'partial'
        }
      ]
    }
  ]

  const totalFeatures = TABLES_DATA.reduce((acc, c) => acc + c.features.length, 0)

  const COLS =
    'grid items-stretch grid-cols-[minmax(0,1.5fr)_repeat(2,minmax(0,1fr))] md:grid-cols-[minmax(0,1.7fr)_repeat(4,minmax(0,1fr))]'
  const NX_BORDER = 'border-x border-gray-900/10'
  const NX_BG = 'bg-gray-900/[0.03]'

  let renderedFeature = 0

  return (
    <section className="relative py-20 md:py-28">
      <div className="mx-auto max-w-5xl px-6">
        <div className="text-center mb-12">
          <p className="text-xs uppercase tracking-[0.3em] text-gray-500 mb-4">{t('label')}</p>
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-gray-900">{t('title')}</h2>
          <p className="text-sm md:text-base text-gray-600 mt-5 max-w-2xl mx-auto text-pretty">{t('subtitle')}</p>
        </div>

        <div className="mx-auto max-w-4xl overflow-hidden rounded-3xl border-4 border-gray-900/20 ring-1 ring-white/40 bg-white/55 px-2 pb-2 shadow-[0_30px_90px_-50px_rgba(0,0,0,0.35)] backdrop-blur-md md:px-4">
          {/* Column headers */}
          <div className={COLS}>
            <div className="px-2 md:px-4" />
            <div
              className={`${NX_BORDER} flex flex-col items-center justify-end gap-1.5 rounded-t-2xl border-t border-gray-900/10 bg-gray-900/[0.05] px-3 pt-5 pb-4`}
            >
              <Image
                src="/logo.png"
                alt="Nexus Timer logo"
                width={64}
                height={64}
                className="size-5 brightness-0"
                unoptimized
              />
              <span className="text-xs font-bold text-gray-900">NXTimer</span>
            </div>
            <div className="flex items-end justify-center px-2 pb-4">
              <span className="text-xs font-medium text-gray-500">csTimer</span>
            </div>
            <div className="hidden items-end justify-center px-2 pb-4 md:flex">
              <span className="text-nowrap text-xs font-medium text-gray-500">Cube Desk</span>
            </div>
            <div className="hidden items-end justify-center px-2 pb-4 md:flex">
              <span className="text-nowrap text-xs font-medium text-gray-500">Twisty Timer</span>
            </div>
          </div>

          {TABLES_DATA.map((cat, cIdx) => (
            <div key={cIdx}>
              {/* Category header */}
              <div className={COLS}>
                <div className={`flex items-center gap-3 px-2 pb-3 md:px-4 ${cIdx === 0 ? 'pt-6' : 'pt-9'}`}>
                  <span className="size-2.5 shrink-0 rounded-[3px]" style={{ backgroundColor: cat.accent }} />
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{cat.title}</p>
                    <p className="text-xs text-gray-500">{cat.description}</p>
                  </div>
                </div>
                <div className={`${NX_BORDER} ${NX_BG}`} />
                <div />
                <div className="hidden md:block" />
                <div className="hidden md:block" />
              </div>

              {/* Feature rows */}
              {cat.features.map((f, fIdx) => {
                renderedFeature += 1
                const isLast = renderedFeature === totalFeatures
                return (
                  <div key={fIdx} className={`${COLS} border-t border-gray-900/5`}>
                    <div className="px-2 py-4 md:px-4">
                      <div className="text-sm font-medium text-gray-900">{f.name}</div>
                      <div className="mt-0.5 text-xs text-gray-500">{f.description}</div>
                    </div>
                    <div
                      className={`${NX_BORDER} ${NX_BG} flex items-center justify-center py-4 ${isLast ? 'rounded-b-2xl border-b border-gray-900/10' : ''}`}
                    >
                      <Rate type={f.nxTimer as Cell} />
                    </div>
                    <div className="flex items-center justify-center py-4">
                      <Rate type={f.csTimer as Cell} />
                    </div>
                    <div className="hidden items-center justify-center py-4 md:flex">
                      <Rate type={f.cubeDesk as Cell} />
                    </div>
                    <div className="hidden items-center justify-center py-4 md:flex">
                      <Rate type={f.twistyTimer as Cell} />
                    </div>
                  </div>
                )
              })}
            </div>
          ))}
        </div>

        {/* Legend */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-gray-500">
          <span className="flex items-center gap-2">
            <Rate type="check" /> {t('legend-full')}
          </span>
          <span className="flex items-center gap-2">
            <Rate type="partial" /> {t('legend-partial')}
          </span>
          <span className="flex items-center gap-2">
            <Rate type="cross" /> {t('legend-none')}
          </span>
        </div>
      </div>
    </section>
  )
}
