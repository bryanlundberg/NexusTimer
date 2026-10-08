import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { useTimerStore } from '@/shared/model/timer/useTimerStore'
import formatTime from '@/shared/lib/formatTime'
import { useTranslations } from 'next-intl'
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle
} from '@/components/ui/alert-dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { cubesDB } from '@/entities/cube/api/indexdb'
import { Cube } from '@/entities/cube/model/types'
import { CubeCategory } from '@/shared/const/cube-categories'
import { useCountdown } from '@/shared/model/useCountdown'

interface ConfirmSolveModalProps {
  isOpen: boolean
  onChoose: (options: { plus2: boolean; dnf: boolean; cubeId: string | null }) => void
  onClose: (open: boolean) => void
  category?: CubeCategory | string
  time?: number
  confirmBy?: number
}

const NONE_VALUE = '__none__'
const STORAGE_KEY = 'free-play-save-cube'

export default function ConfirmSolveModal({
  isOpen,
  onClose,
  onChoose,
  category,
  time,
  confirmBy
}: ConfirmSolveModalProps) {
  const t = useTranslations('Multiplayer.confirm-solve')
  const solvingTime = useTimerStore((store) => store.solvingTime)
  const { mmss, remainingMs } = useCountdown(isOpen ? confirmBy : undefined, { intervalMs: 250 })
  const [cubes, setCubes] = useState<Cube[]>([])
  const [selectedCubeId, setSelectedCubeId] = useState<string>(NONE_VALUE)

  useEffect(() => {
    if (!isOpen) return
    const cached = useTimerStore.getState().cubes
    ;(cached ? Promise.resolve(cached) : cubesDB.getAll()).then((all) => {
      const filtered = category ? all.filter((c) => c.category === category) : all
      setCubes(filtered)

      const stored = typeof window !== 'undefined' ? localStorage.getItem(`${STORAGE_KEY}:${category ?? ''}`) : null
      if (stored && filtered.some((c) => c.id === stored)) {
        setSelectedCubeId(stored)
      } else {
        setSelectedCubeId(NONE_VALUE)
      }
    })
  }, [isOpen, category])

  const handleSelect = (value: string) => {
    setSelectedCubeId(value)
    if (typeof window !== 'undefined') {
      if (value === NONE_VALUE) localStorage.removeItem(`${STORAGE_KEY}:${category ?? ''}`)
      else localStorage.setItem(`${STORAGE_KEY}:${category ?? ''}`, value)
    }
  }

  const handleClose = (options: { plus2: boolean; dnf: boolean }) => {
    onClose(false)
    onChoose({ ...options, cubeId: selectedCubeId === NONE_VALUE ? null : selectedCubeId })
  }

  return (
    <AlertDialog
      open={isOpen}
      onOpenChange={(open) => {
        if (open) onClose(true)
      }}
    >
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{t('title', { time: formatTime(time ?? solvingTime) })}</AlertDialogTitle>
          <AlertDialogDescription className="mb-4">
            {t('description')}
            {remainingMs !== undefined && (
              <span className="mt-1 block tabular-nums">{t('auto-dnf', { time: mmss })}</span>
            )}
          </AlertDialogDescription>

          <div className="mb-4 space-y-1.5">
            <label htmlFor="confirm-solve-cube" className="text-[13px] text-muted-foreground sm:text-xs">
              {t('save-to-cube-label')}
            </label>
            <Select value={selectedCubeId} onValueChange={handleSelect} disabled={cubes.length === 0}>
              <SelectTrigger id="confirm-solve-cube" className="h-10 w-full pointer-coarse:h-11">
                <SelectValue placeholder={cubes.length === 0 ? t('save-to-cube-empty') : t('save-to-cube-none')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={NONE_VALUE}>{t('save-to-cube-none')}</SelectItem>
                {cubes.map((cube) => (
                  <SelectItem key={cube.id} value={cube.id}>
                    {cube.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-3 gap-2 [&>*]:pointer-coarse:h-12">
            <Button
              className={'w-full'}
              variant={'destructive'}
              onClick={() => handleClose({ plus2: false, dnf: true })}
            >
              {t('dnf')}
            </Button>
            <Button className={'w-full'} variant={'secondary'} onClick={() => handleClose({ plus2: true, dnf: false })}>
              {t('plus2')}
            </Button>
            <Button className={'w-full'} variant={'default'} onClick={() => handleClose({ plus2: false, dnf: false })}>
              {t('ok')}
            </Button>
          </div>
        </AlertDialogHeader>
      </AlertDialogContent>
    </AlertDialog>
  )
}
