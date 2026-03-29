import { MenuSection } from './MenuSection'
import { useTranslations } from 'next-intl'
import { GlobeIcon } from '@radix-ui/react-icons'
import SelectLanguage from '@/widgets/select-language/ui/SelectLanguage'

export default function MenuSelectLanguage() {
  const t = useTranslations('Index')

  return (
    <MenuSection id="region" icon={<GlobeIcon />} title={t('Settings-menu.locale')}>
      <div className="px-3 py-2 transition-colors hover:bg-muted/30">
        <div className="flex items-center justify-between gap-3">
          <div className="flex flex-col gap-0.5 min-w-0">
            <span className="text-sm font-medium leading-tight">{t('Settings-menu.language')}</span>
            <span className="text-xs text-muted-foreground leading-snug">
              {t('Settings-descriptions.language-description')}
            </span>
          </div>
          <SelectLanguage />
        </div>
      </div>
    </MenuSection>
  )
}
