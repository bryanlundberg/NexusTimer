import formatTime from '@/shared/lib/formatTime'
import { useTimerStore } from '@/store/timerStore'
import { CalendarIcon, ClockIcon } from '@radix-ui/react-icons'
import { DateTime } from 'luxon'
import { useLocale } from 'next-intl'
import { DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import ScrambleDisplay from '@/shared/ui/scramble-display/ui/ScrambleDisplay'
import { useOverlayStore } from '@/shared/model/overlay-store/useOverlayStore'
import { Solve } from '@/entities/solve/model/types'
import QuickActions from '@/features/manage-solves/ui/QuickActions'

export default function SolveDetails() {
  const overlayStore = useOverlayStore()
  const selectedCube = useTimerStore((state) => state.selectedCube)
  const locale = useLocale()
  const { activeOverlay } = overlayStore

  return (
    <DialogContent showCloseButton={false}>
      <DialogHeader>
        <DialogTitle className={'text-sm flex justify-between'}>
          <div className="flex gap-1 items-center">
            <span className={'text-2xl'}>{formatTime(activeOverlay?.metadata?.time || 0)}</span>
            <Badge className={'text-xs h-fit'}>{selectedCube?.category || 'Unknown'}</Badge>
          </div>
          <div className={'flex flex-col items-end text-xs font-normal'}>
            <p className="flex items-center justify-center gap-1">
              <CalendarIcon />
              {DateTime.fromMillis(activeOverlay?.metadata?.endTime || 0)
                .setLocale(locale)
                .toFormat('DDDD')}
            </p>
            <p className="flex items-center justify-center gap-1">
              <ClockIcon />
              {DateTime.fromMillis(activeOverlay?.metadata?.endTime || 0)
                .setLocale(locale)
                .toFormat('HH:mm:ss')}
            </p>
          </div>
        </DialogTitle>
        <DialogDescription className="text-md text-start">{activeOverlay?.metadata?.scramble}</DialogDescription>
        <ScrambleDisplay
          show={true}
          scramble={activeOverlay?.metadata?.scramble || ''}
          event={selectedCube?.category || '3x3'}
          className="h-20 md:h-24 lg:h-28 xl:h-32 2xl:h-36"
          visualization="2D"
        />
        {activeOverlay?.metadata && <QuickActions solve={activeOverlay?.metadata as Solve} />}
      </DialogHeader>
    </DialogContent>
  )
}
