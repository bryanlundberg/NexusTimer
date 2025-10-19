import { VisuallyHidden } from '@radix-ui/react-visually-hidden'
import { Button } from '@/components/ui/button'
import { useTimerStore } from '@/store/timerStore'
import formatTime from '@/lib/formatTime'
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from '@/components/ui/alert-dialog'

interface ConfirmSolveModalProps {
  isOpen: boolean
  onChoose: (options: { plus2: boolean; dnf: boolean }) => void
  onClose: () => void
}

export default function ConfirmSolveModal({ isOpen, onClose, onChoose }: ConfirmSolveModalProps) {
  const solvingTime = useTimerStore((store) => store.solvingTime)
  const handleClose = (options: { plus2: boolean; dnf: boolean }) => {
    onClose()
    onChoose(options)
  }

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <VisuallyHidden>
        <AlertDialogTrigger>Open</AlertDialogTrigger>
      </VisuallyHidden>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Confirm Solve Time ({formatTime(solvingTime)})</AlertDialogTitle>
          <AlertDialogDescription>
            <p className="text-sm text-muted-foreground mb-4">How would you like to register this solve?</p>
            <div className={'grid grid-cols-3 gap-2'}>
              <Button
                className={'w-full'}
                variant={'destructive'}
                onClick={() => handleClose({ plus2: false, dnf: true })}
              >
                DNF
              </Button>
              <Button
                className={'w-full'}
                variant={'secondary'}
                onClick={() => handleClose({ plus2: true, dnf: false })}
              >
                +2
              </Button>
              <Button
                className={'w-full'}
                variant={'default'}
                onClick={() => handleClose({ plus2: false, dnf: false })}
              >
                OK
              </Button>
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
      </AlertDialogContent>
    </AlertDialog>
  )
}
