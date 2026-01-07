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

interface ConfirmSolveModalProps {
  isOpen: boolean
  onChoose: (options: { plus2: boolean; dnf: boolean }) => void
  onClose: (open: boolean) => void
}

export default function ConfirmSolveModal({ isOpen, onClose, onChoose }: ConfirmSolveModalProps) {
  const t = useTranslations('Multiplayer.confirm-solve')
  const solvingTime = useTimerStore((store) => store.solvingTime)
  const handleClose = (options: { plus2: boolean; dnf: boolean }) => {
    onClose(false)
    onChoose(options)
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
