import exportDataToFile from '@/features/settings/lib/exportDataToFile'
import { useTranslations } from 'next-intl'
import { ExportIcon } from '@/components/ui/settings-icons'
import { Button } from '@/components/ui/button'
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
    <div className="flex flex-col gap-4 px-3 py-2">
      <div ref={importSectionRef} className="flex flex-col gap-2 scroll-mt-20">
        <div>
          <p className="flex items-center gap-1.5 text-sm font-medium">{t('Settings-menu.import-from-file')}</p>
          <p className="text-xs text-muted-foreground">{t('backup-modal.description')}</p>
        </div>
        <ImportBackupInline />
      </div>

      <div className="flex flex-wrap gap-2 border-t pt-3">
        <Button
          variant={'outline'}
          className="flex items-center gap-1"
          onClick={handleExport}
          data-testid="export-data-to-file-button"
        >
          <ExportIcon className="size-4" />
          {t('Settings-menu.export-to-file')}
        </Button>
      </div>

      <div className="text-xs text-muted-foreground">{t('Settings-descriptions.data-import-export')}</div>
    </div>
  )
}
