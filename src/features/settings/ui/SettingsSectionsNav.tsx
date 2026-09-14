'use client'
import { useTranslations } from 'next-intl'
import { cn } from '@/shared/lib/utils'
import useScrollSpy from '@/shared/model/useScrollSpy'
import { SETTINGS_SECTIONS, SETTINGS_SECTION_IDS } from '../lib/settingsSections'

interface SettingsSectionsNavProps {
  observeKey?: unknown
}

export default function SettingsSectionsNav({ observeKey }: SettingsSectionsNavProps) {
  const t = useTranslations('Index')
  const activeId = useScrollSpy(SETTINGS_SECTION_IDS, observeKey)

  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <nav aria-label={t('SettingsPage.options')} className="hidden lg:flex w-52 shrink-0 sticky top-20 flex-col gap-0.5">
      {SETTINGS_SECTIONS.map(({ id, icon: Icon, color, titleKey }) => {
        const isActive = activeId === id
        return (
          <button
            key={id}
            type="button"
            onClick={() => scrollToSection(id)}
            data-active={isActive ? 'true' : undefined}
            aria-current={isActive ? 'true' : undefined}
            style={{ '--nav-accent': color } as React.CSSProperties}
            className={cn(
              'nav-notch flex items-center gap-2.5 pl-2 pr-3 py-2 text-sm text-left transition-colors',
              isActive ? 'text-foreground font-medium' : 'text-muted-foreground hover:text-foreground'
            )}
          >
            <span
              className="h-4 w-0.5 shrink-0 transition-colors"
              style={{ backgroundColor: isActive ? color : 'transparent' }}
              aria-hidden
            />
            <Icon className="size-4 shrink-0 transition-colors" style={isActive ? { color } : undefined} />
            <span className="truncate">{t(titleKey)}</span>
          </button>
        )
      })}
    </nav>
  )
}
