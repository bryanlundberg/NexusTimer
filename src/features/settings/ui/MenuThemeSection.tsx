import { useTranslations } from 'next-intl'
import { MenuSection } from './MenuSection'
import ThemeSelect from './ThemeSelect'
import MenuSelectColor from './MenuSelectColor'

export default function MenuThemeSection() {
  const t = useTranslations('Index')

  return (
    <MenuSection id="background" title={t('Settings-menu.theme')}>
      <ThemeSelect />
      <MenuSelectColor />
    </MenuSection>
  )
}
