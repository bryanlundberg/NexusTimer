import { useTranslations } from 'next-intl'
import { MenuSection } from './MenuSection'
import MenuToggleAnalytics from './MenuToggleAnalytics'

export default function MenuPrivacySection() {
  const t = useTranslations('Index')

  return (
    <MenuSection id="privacy" title={t('Settings-menu.privacy')}>
      <MenuToggleAnalytics />
    </MenuSection>
  )
}
