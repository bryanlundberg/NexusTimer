'use client'
import { useTranslations } from 'next-intl'
import { languages } from '@/shared/const/languages'
import { useSwitchLocale } from '@/shared/config/i18n/useSwitchLocale'
import { MenuSection } from './MenuSection'
import MenuSelectOption from './MenuSelectOption'

export default function MenuSelectLanguage() {
  const t = useTranslations('Index')
  const { locale, switchLocale, isPending } = useSwitchLocale()

  return (
    <MenuSection id="region" title={t('Settings-menu.locale')}>
      <MenuSelectOption
        label={t('Settings-menu.language')}
        description={t('Settings-descriptions.language-description')}
        value={locale}
        onValueChange={switchLocale}
        disabled={isPending}
        options={languages.map((item) => ({
          value: item.code,
          label: (
            <span className="flex items-center gap-2">
              {item.flag}
              {item.name}
            </span>
          )
        }))}
      />
    </MenuSection>
  )
}
