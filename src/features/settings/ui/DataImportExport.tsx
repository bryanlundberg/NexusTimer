import exportDataToFile from '@/features/settings/lib/exportDataToFile'
import { useTranslations } from 'next-intl'
import { DownloadIcon, UploadIcon } from '@radix-ui/react-icons'
import { Button } from '@/components/ui/button'
import { useOverlayStore } from '@/shared/model/overlay-store/useOverlayStore'
import ImportBackup from '@/features/manage-backup/ui/ImportBackup'
import { cubesDB } from '@/entities/cube/api/indexdb'

export function DataImportExport() {
  const t = useTranslations('Index')
  const open = useOverlayStore((state) => state.open)

  const handleExport = async () => {
    try {
      const cubes = await cubesDB.getAll()
      await exportDataToFile(cubes)
    } catch (error) {
      console.error('Error exporting data:', error)
    }
  }

  const handleOpenImport = () => {
    open({
      id: 'import-backup',
      component: <ImportBackup />
    })
  }

  return (
    <div className="ps-3 pe-3 mb-3">
      <div className="flex flex-wrap gap-2 mb-1">
        <Button variant={'outline'} onClick={handleOpenImport}>
          <DownloadIcon /> {t('Settings-menu.import-from-file')}
        </Button>

        <Button variant={'outline'} className="flex items-center gap-1" onClick={handleExport}>
          <UploadIcon />
          {t('Settings-menu.export-to-file')}
        </Button>
      </div>
      <div className="text-xs text-muted-foreground">{t('Settings-descriptions.data-import-export')}</div>
    </div>
  )
}
