import exportDataToFile from '@/features/settings/lib/exportDataToFile'
import { useTranslations } from 'next-intl'
import { UploadIcon } from '@radix-ui/react-icons'
import { Button } from '@/components/ui/button'
import ImportBackupInline from '@/features/manage-backup/ui/ImportBackupInline'
import { cubesDB } from '@/entities/cube/api/indexdb'
import { Merge } from 'lucide-react'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { toast } from 'sonner'
import { useTimerStore } from '@/shared/model/timer/useTimerStore'
import { normalizeOldData, preventDuplicateDeleteStatus } from '@/features/manage-backup/lib/importDataFromFile'
import { reconcileSolvesAcrossCubes } from '@/shared/model/backup/reconcileSolvesAcrossCubes'
import { useQueryState } from 'nuqs'
import { useEffect, useRef } from 'react'

export function DataImportExport() {
  const t = useTranslations('Index')
  const setCubes = useTimerStore((state) => state.setCubes)
  const setSelectedCube = useTimerStore((state) => state.setSelectedCube)
  const resetTimer = useTimerStore((state) => state.reset)
  const setLastSolve = useTimerStore((state) => state.setLastSolve)
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

  const handleNormalizeDatabase = async () => {
    try {
      const db = await cubesDB.getAllDatabase()

      const normalizedDB = reconcileSolvesAcrossCubes(preventDuplicateDeleteStatus(normalizeOldData(db)))

      await cubesDB.clear()
      for (const cube of normalizedDB) {
        await cubesDB.update(cube)
      }

      const refreshedCubes = await cubesDB.getAll()
      setCubes(refreshedCubes)
      setSelectedCube(null)
      resetTimer()
      setLastSolve(null)

      toast.success('Database normalized successfully.')
    } catch (error) {
      console.error('Error normalizing database:', error)
    }
  }

  return (
    <div className="flex flex-col gap-4 px-3 py-2">
      <div ref={importSectionRef} className="flex flex-col gap-2 scroll-mt-20">
        <div>
          <p className="text-sm font-medium">{t('Settings-menu.import-from-file')}</p>
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
          <UploadIcon />
          {t('Settings-menu.export-to-file')}
        </Button>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant={'outline'}
              className={'flex items-center gap-1'}
              onClick={handleNormalizeDatabase}
              data-testid="normalize-database-button"
            >
              <Merge />
              Normalize Database
            </Button>
          </TooltipTrigger>
          <TooltipContent className={'max-w-xs'}>
            Updates database structures to maintain data integrity. Run periodically to keep your database optimized,
            especially after app updates.
          </TooltipContent>
        </Tooltip>
      </div>

      <div className="text-xs text-muted-foreground">{t('Settings-descriptions.data-import-export')}</div>
    </div>
  )
}
