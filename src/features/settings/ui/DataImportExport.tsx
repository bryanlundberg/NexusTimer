import exportDataToFile from '@/features/settings/lib/exportDataToFile'
import { useTranslations } from 'next-intl'
import { DownloadIcon, UploadIcon } from '@radix-ui/react-icons'
import { Button } from '@/components/ui/button'
import { useOverlayStore } from '@/shared/model/overlay-store/useOverlayStore'
import ImportBackup from '@/features/manage-backup/ui/ImportBackup'
import { cubesDB } from '@/entities/cube/api/indexdb'
import { Merge } from 'lucide-react'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { toast } from 'sonner'
import { useTimerStore } from '@/shared/model/timer/useTimerStore'
import { useQueryState } from 'nuqs'
import { useEffect } from 'react'

export function DataImportExport() {
  const t = useTranslations('Index')
  const open = useOverlayStore((state) => state.open)
  const setCubes = useTimerStore((state) => state.setCubes)
  const setSelectedCube = useTimerStore((state) => state.setSelectedCube)
  const resetTimer = useTimerStore((state) => state.reset)
  const setLastSolve = useTimerStore((state) => state.setLastSolve)
  const [redirect, setRedirect] = useQueryState('redirect', { defaultValue: '' })

  const handleExport = async () => {
    try {
      const cubes = await cubesDB.getAllDatabase()
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

  useEffect(() => {
    if (redirect === 'import') {
      handleOpenImport()
      setRedirect('')
    }
  }, [redirect, setRedirect])

  const handleNormalizeDatabase = async () => {
    try {
      const db = await cubesDB.getAllDatabase()
      const normalizedDB = db.map((cube) => {
        return {
          ...cube,
          solves: {
            ...cube.solves,
            session: (cube.solves.session || []).map((solve) => ({
              ...solve,
              cubeId: cube.id,
              isDeleted: solve.isDeleted || false,
              updatedAt: solve.updatedAt || Date.now()
            })),
            all: (cube.solves.all || []).map((solve) => ({
              ...solve,
              cubeId: cube.id,
              isDeleted: solve.isDeleted || false,
              updatedAt: solve.updatedAt || Date.now()
            }))
          },
          updatedAt: Date.now(),
          isDeleted: cube.isDeleted || false
        }
      })

      for (const cube of normalizedDB) {
        const allSolvesFromBoth = [
          ...cube.solves.all.map((s) => ({ ...s, source: 'all' as const })),
          ...cube.solves.session.map((s) => ({ ...s, source: 'session' as const }))
        ]

        const solvesMap = new Map<string, any>()
        for (const solve of allSolvesFromBoth) {
          const existing = solvesMap.get(solve.id)

          if (!existing) {
            solvesMap.set(solve.id, solve)
          } else if (existing.updatedAt < solve.updatedAt) {
            solvesMap.set(solve.id, solve)
          } else if (
            existing.updatedAt === solve.updatedAt &&
            existing.source === 'all' &&
            solve.source === 'session'
          ) {
            solvesMap.set(solve.id, solve)
          }
        }

        const uniqueSolves = Array.from(solvesMap.values())
        cube.solves.all = uniqueSolves.filter((solve) => solve.source === 'all').map(({ source, ...solve }) => solve)

        cube.solves.session = uniqueSolves
          .filter((solve) => solve.source === 'session')
          .map(({ source, ...solve }) => solve)
      }

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
    <div className="ps-3 pe-3 mb-3">
      <div className="flex flex-wrap gap-2 mb-1">
        <Button
          variant={'outline'}
          onClick={handleOpenImport}
          data-testid="open-import-backup-button"
          className="flex items-center gap-1"
        >
          <DownloadIcon /> {t('Settings-menu.import-from-file')}
        </Button>

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
              data-testid="export-data-to-file-button"
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
