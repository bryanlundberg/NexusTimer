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
      {SETTINGS_SECTIONS.map(({ id, icon: Icon, accent, titleKey }) => (
        <button
          key={id}
          type="button"
          onClick={() => scrollToSection(id)}
          className={cn(
            'flex items-center gap-2.5 rounded-md pl-2 pr-3 py-2 text-sm text-left transition-colors',
            activeId === id
              ? 'bg-muted/60 text-foreground font-medium'
              : 'text-muted-foreground hover:text-foreground hover:bg-muted/40'
          )}
        >
          <span
            className={cn(
              'h-4 w-0.5 rounded-full shrink-0 transition-colors',
              activeId === id ? accent : 'bg-transparent'
            )}
            aria-hidden
          />
          <Icon className="size-4 shrink-0" />
          <span className="truncate">{t(titleKey)}</span>
        </button>
      ))}
    </nav>
  )
}
