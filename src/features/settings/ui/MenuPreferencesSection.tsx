import { useTranslations } from 'next-intl'
import { BoxModelIcon } from '@radix-ui/react-icons'
import { MenuSection } from './MenuSection'
import MenuSelectDefaultStartCube from './MenuSelectDefaultStartCube'
import { SECTION_ACCENTS } from '../lib/settingsSections'

export default function MenuPreferencesSection() {
  const t = useTranslations('Index')

  return (
    <MenuSection
      id="preferences"
      accent={SECTION_ACCENTS['preferences']}
      icon={<BoxModelIcon />}
      title={t('Settings-menu.preferences')}
    >
      <MenuSelectDefaultStartCube />
    </MenuSection>
  )
}
