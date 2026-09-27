import { useTranslations } from 'next-intl'
import { MenuSection } from './MenuSection'
import { DataImportExport } from './DataImportExport'

export default function MenuDataSection() {
  const t = useTranslations('Index')

  return (
    <MenuSection id="app-data" title={t('Settings-menu.data')} footer={t('Settings-descriptions.data-import-export')}>
      <DataImportExport />
    </MenuSection>
  )
}
