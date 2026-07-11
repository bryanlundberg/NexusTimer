import { MenuSection } from './MenuSection'
import { MenuRow } from './MenuRow'
import { useTranslations } from 'next-intl'
import { GlobeIcon } from '@radix-ui/react-icons'
import SelectLanguage from '@/widgets/select-language/ui/SelectLanguage'
import { SECTION_ACCENTS } from '../lib/settingsSections'

export default function MenuSelectLanguage() {
  const t = useTranslations('Index')

  return (
    <MenuSection id="region" accent={SECTION_ACCENTS['region']} icon={<GlobeIcon />} title={t('Settings-menu.locale')}>
      <MenuRow label={t('Settings-menu.language')} description={t('Settings-descriptions.language-description')}>
        <SelectLanguage />
      </MenuRow>
    </MenuSection>
  )
}
