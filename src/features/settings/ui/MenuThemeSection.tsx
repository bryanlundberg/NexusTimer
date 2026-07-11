import { useTranslations } from 'next-intl'
import { ComponentBooleanIcon } from '@radix-ui/react-icons'
import { MenuSection } from './MenuSection'
import ThemeSelect from './ThemeSelect'
import CustomTheme from './CustomTheme'
import MenuSelectColor from './MenuSelectColor'
import { SECTION_ACCENTS } from '../lib/settingsSections'

export default function MenuThemeSection() {
  const t = useTranslations('Index')

  return (
    <MenuSection
      id="background"
      accent={SECTION_ACCENTS['background']}
      icon={<ComponentBooleanIcon />}
      title={t('Settings-menu.theme')}
    >
      <ThemeSelect />
      <CustomTheme />
      <MenuSelectColor />
    </MenuSection>
  )
}
