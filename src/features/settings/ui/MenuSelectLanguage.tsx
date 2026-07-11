import { MenuSection } from './MenuSection'
import { MenuRow } from './MenuRow'
import { useTranslations } from 'next-intl'
import { GlobeIcon } from '@radix-ui/react-icons'
import SelectLanguage from '@/widgets/select-language/ui/SelectLanguage'

export default function MenuSelectLanguage() {
  const t = useTranslations('Index')

  return (
    <MenuSection id="region" accent="bg-cube-red" icon={<GlobeIcon />} title={t('Settings-menu.locale')}>
      <MenuRow label={t('Settings-menu.language')} description={t('Settings-descriptions.language-description')}>
        <SelectLanguage />
      </MenuRow>
    </MenuSection>
  )
}
