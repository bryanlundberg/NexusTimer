import formatTime from '@/shared/lib/formatTime'
import { useTimerStore } from '@/shared/model/timer/useTimerStore'
import { CalendarIcon, ClockIcon } from '@radix-ui/react-icons'
import { DateTime } from 'luxon'
import { useLocale, useTranslations } from 'next-intl'
import { DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import ScrambleDisplay from '@/shared/ui/scramble-display/ui/ScrambleDisplay'
import { useOverlayStore } from '@/shared/model/overlay-store/useOverlayStore'
import { Solve } from '@/entities/solve/model/types'
import QuickActions from '@/features/manage-solves/ui/QuickActions'

export default function SolveDetails() {
  const t = useTranslations('Index')
  const overlayStore = useOverlayStore()
  const selectedCube = useTimerStore((state) => state.selectedCube)
  const locale = useLocale()
  const { activeOverlay } = overlayStore

  const solve = activeOverlay?.metadata as Solve | undefined
  const formattedDate = DateTime.fromMillis(solve?.endTime || 0)
    .setLocale(locale)
    .toFormat('DDDD')
  const formattedTime = DateTime.fromMillis(solve?.endTime || 0)
    .setLocale(locale)
    .toFormat('HH:mm:ss')

  return (
    <DialogContent
      showCloseButton={true}
      className="gap-0 p-0 overflow-hidden max-h-[90dvh] flex flex-col"
      data-testid="solve-details-dialog-content"
    >
      <div className="overflow-y-auto flex-1">
        {/* Header */}
        <DialogHeader className="px-4 pt-4 pb-3 sm:px-5 sm:pt-5 items-center text-center">
          <div className="flex items-baseline justify-center gap-2">
            <DialogTitle className="text-2xl sm:text-3xl font-mono font-bold tracking-tight tabular-nums">
              {formatTime(solve?.time || 0)}
            </DialogTitle>
            <Badge variant="secondary" className="text-[10px]">
              {selectedCube?.category || t('solve-details.unknown-category')}
            </Badge>
          </div>
          <div className="flex items-center justify-center gap-2 text-[11px] text-muted-foreground mt-1">
            <span className="flex items-center gap-1">
              <CalendarIcon className="size-3" />
              {formattedDate}
            </span>
            <span className="text-border">·</span>
            <span className="flex items-center gap-1">
              <ClockIcon className="size-3" />
              {formattedTime}
            </span>
          </div>
        </DialogHeader>

        {/* Scramble */}
        <div className="px-4 pb-3 sm:px-5">
          <DialogDescription className="text-xs text-muted-foreground mb-2 font-mono leading-relaxed select-all break-words text-center">
            {solve?.scramble}
          </DialogDescription>
          <div className="rounded-md bg-muted/40 p-1.5">
            <ScrambleDisplay
              show={true}
              scramble={solve?.scramble || ''}
              event={selectedCube?.category || '3x3'}
              className="h-16 sm:h-20 md:h-24"
              visualization="2D"
            />
          </div>
        </div>
      </div>

      {/* Actions - compact bottom bar */}
      <div className="px-4 py-2.5 border-t shrink-0 sm:px-5">{solve && <QuickActions solve={solve} />}</div>
    </DialogContent>
  )
}
