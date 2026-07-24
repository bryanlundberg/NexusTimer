import { useTranslations } from 'next-intl'
import { PreferencesIcon } from '@/components/ui/settings-icons'
import { MenuSection } from './MenuSection'
import MenuSelectDefaultStartCube from './MenuSelectDefaultStartCube'
import { SECTION_ACCENTS } from '../lib/settingsSections'

export default function MenuPreferencesSection() {
  const t = useTranslations('Index')

  return (
    <MenuSection
      id="preferences"
      accent={SECTION_ACCENTS['preferences']}
      icon={<PreferencesIcon />}
      title={t('Settings-menu.preferences')}
    >
      <MenuSelectDefaultStartCube />
    </MenuSection>
  )
}
