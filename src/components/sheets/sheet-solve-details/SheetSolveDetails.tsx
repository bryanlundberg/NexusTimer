import MenuSolveOptions from '@/components/menu-solve-options/menu-solve-options';
import { ScrambleDisplay } from '@/components/scramble-display';
import formatTime from '@/lib/formatTime';
import { useDialogSolve } from '@/store/DialogSolve';
import { useTimerStore } from '@/store/timerStore';
import { CalendarIcon, ClockIcon, } from '@radix-ui/react-icons';
import { DateTime } from 'luxon';
import { useLocale } from 'next-intl';
import { DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';

export default function SheetSolveDetails() {
  const { handleCloseDialogSolve } = useDialogSolve();
  const { solve } = useDialogSolve();
  const selectedCube = useTimerStore((state) => state.selectedCube);
  const locale = useLocale();

  return (
    <DialogContent showCloseButton={false}>
      <DialogHeader>
        <DialogTitle className={'text-sm flex justify-between'}>
          <div className="flex gap-1 items-center">
            <span className={'text-2xl'}>{formatTime(solve?.time || 0)}</span>
            <Badge className={'text-xs h-fit'}>
              {selectedCube?.category || 'Unknown'}
            </Badge>
          </div>
          <div className={'flex flex-col items-end text-xs font-normal'}>
            <p className="flex items-center justify-center gap-1">
              <CalendarIcon/>
              {DateTime.fromMillis(solve?.endTime || 0)
                .setLocale(locale)
                .toFormat('DDDD')}
            </p>
            <p className="flex items-center justify-center gap-1">
              <ClockIcon/>
              {DateTime.fromMillis(solve?.endTime || 0)
                .setLocale(locale)
                .toFormat('HH:mm:ss')}
            </p>
          </div>
        </DialogTitle>

        <DialogDescription className="text-md text-start">
          {solve?.scramble}
        </DialogDescription>

        <ScrambleDisplay
          show={true}
          scramble={solve?.scramble || ''}
          event={selectedCube?.category || '3x3'}
          className="h-20 md:h-24 lg:h-28 xl:h-32 2xl:h-36"
          visualization="2D"
        />

        {solve && (
          <MenuSolveOptions
            solve={solve}
            onDeleteSolve={handleCloseDialogSolve}
            caseOfUse="modal-solve"
          />
        )}
      </DialogHeader>
    </DialogContent>
  );
}
