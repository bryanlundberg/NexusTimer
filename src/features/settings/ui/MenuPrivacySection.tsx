import { useTranslations } from 'next-intl'
import { PrivacyIcon } from '@/components/ui/settings-icons'
import { MenuSection } from './MenuSection'
import MenuToggleAnalytics from './MenuToggleAnalytics'
import { SECTION_ACCENTS } from '../lib/settingsSections'

export default function MenuPrivacySection() {
  const t = useTranslations('Index')

  return (
    <MenuSection
      id="privacy"
      accent={SECTION_ACCENTS['privacy']}
      icon={<PrivacyIcon />}
      title={t('Settings-menu.privacy')}
    >
      <MenuToggleAnalytics />
    </MenuSection>
  )
}
