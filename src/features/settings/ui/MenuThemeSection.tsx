import { useTranslations } from 'next-intl'
import { ThemeIcon } from '@/components/ui/settings-icons'
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
      icon={<ThemeIcon />}
      title={t('Settings-menu.theme')}
    >
      <ThemeSelect />
      <CustomTheme />
      <MenuSelectColor />
    </MenuSection>
  )
}
