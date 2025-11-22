import { MenuSection } from './MenuSection'
import { useTranslations } from 'next-intl'
import { GlobeIcon } from '@radix-ui/react-icons'
import SelectLanguage from '@/widgets/select-language/ui/SelectLanguage'

export default function MenuSelectLanguage() {
  const t = useTranslations('Index')

  return (
    <>
      <MenuSection id="region" icon={<GlobeIcon />} title={t('Settings-menu.locale')}>
        <div className="mx-3 mb-3">
          <div className="flex items-center justify-between mb-1">
            <div className="grow">{t('Settings-menu.language')}</div>
            <SelectLanguage />
          </div>
          <div className="text-xs text-muted-foreground">{t('Settings-descriptions.language-description')}</div>
        </div>
      </MenuSection>
    </>
  )
}
