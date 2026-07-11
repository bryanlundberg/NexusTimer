import { useTranslations } from 'next-intl'
import { FileTextIcon } from '@radix-ui/react-icons'
import { MenuSection } from './MenuSection'
import { DataImportExport } from './DataImportExport'
import { SECTION_ACCENTS } from '../lib/settingsSections'

export default function MenuDataSection() {
  const t = useTranslations('Index')

  return (
    <MenuSection
      id="app-data"
      accent={SECTION_ACCENTS['app-data']}
      icon={<FileTextIcon />}
      title={t('Settings-menu.data')}
    >
      <DataImportExport />
    </MenuSection>
  )
}
