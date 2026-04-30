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

interface ConfirmSolveModalProps {
  isOpen: boolean
  onChoose: (options: { plus2: boolean; dnf: boolean; cubeId: string | null }) => void
  onClose: (open: boolean) => void
  category?: CubeCategory | string
}

const NONE_VALUE = '__none__'
const STORAGE_KEY = 'free-play-save-cube'

export default function ConfirmSolveModal({ isOpen, onClose, onChoose, category }: ConfirmSolveModalProps) {
  const t = useTranslations('Multiplayer.confirm-solve')
  const solvingTime = useTimerStore((store) => store.solvingTime)
  const [cubes, setCubes] = useState<Cube[]>([])
  const [selectedCubeId, setSelectedCubeId] = useState<string>(NONE_VALUE)

  useEffect(() => {
    if (!isOpen) return
    cubesDB.getAll().then((all) => {
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
          <AlertDialogTitle>{t('title', { time: formatTime(solvingTime) })}</AlertDialogTitle>
          <AlertDialogDescription></AlertDialogDescription>
          <div className="text-sm text-muted-foreground mb-4">{t('description')}</div>

          <div className="mb-4 space-y-1.5">
            <label className="text-xs text-muted-foreground">{t('save-to-cube-label')}</label>
            <Select value={selectedCubeId} onValueChange={handleSelect} disabled={cubes.length === 0}>
              <SelectTrigger className="w-full h-9">
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

          <div className={'grid grid-cols-3 gap-2'}>
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
