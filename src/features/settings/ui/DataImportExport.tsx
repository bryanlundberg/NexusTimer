import exportDataToFile from '@/features/settings/lib/exportDataToFile'
import { useTranslations } from 'next-intl'
import { ExportIcon } from '@/components/ui/settings-icons'
import { MenuActionRow } from './MenuActionRow'
import { MenuRowText } from './MenuRowText'
import ImportBackupInline from '@/features/manage-backup/ui/ImportBackupInline'
import { cubesDB } from '@/entities/cube/api/indexdb'
import { useQueryState } from 'nuqs'
import { useEffect, useRef } from 'react'

export function DataImportExport() {
  const t = useTranslations('Index')
  const [redirect, setRedirect] = useQueryState('redirect', { defaultValue: '' })
  const importSectionRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (redirect === 'import') {
      importSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })
      setRedirect('')
    }
  }, [redirect, setRedirect])

  const handleExport = async () => {
    try {
      const cubes = await cubesDB.getAllDatabase()
      await exportDataToFile(cubes)
    } catch (error) {
      console.error('Error exporting data:', error)
    }
  }

  return (
    <>
      <div ref={importSectionRef} className="flex scroll-mt-20 flex-col gap-3 px-4 py-3.5">
        <MenuRowText label={t('Settings-menu.import-from-file')} description={t('backup-modal.description')} />
        <ImportBackupInline />
      </div>
      <MenuActionRow
        icon={<ExportIcon />}
        label={t('Settings-menu.export-to-file')}
        onClick={handleExport}
        data-testid="export-data-to-file-button"
      />
    </>
  )
}
