import MenuSolveOptions from "@/components/menu-solve-options/menu-solve-options";
import { ScrambleDisplay } from "@/components/scramble-display";
import formatTime from "@/lib/formatTime";
import { useDialogSolve } from "@/store/DialogSolve";
import { useTimerStore } from "@/store/timerStore";
import {
  CalendarIcon,
  ClockIcon,
} from "@radix-ui/react-icons";
import { DateTime } from "luxon";
import { useLocale } from "next-intl";
import { DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';

export default function SheetSolveDetails() {
  const { handleCloseDialogSolve } = useDialogSolve();
  const { solve } = useDialogSolve();
  const { selectedCube } = useTimerStore();
  const locale = useLocale();

  return (
    <DialogContent showCloseButton={false}>
      <DialogHeader>
        <DialogTitle className={"text-sm flex justify-between"}>
          {formatTime(solve?.time || 0)}
          <p className="flex items-center justify-center gap-1">
            <CalendarIcon />
            {DateTime.fromMillis(solve?.endTime || 0)
              .setLocale(locale)
              .toLocaleString()}
          </p>
        </DialogTitle>

        <DialogDescription className="text-md text-start">
          {solve?.scramble}
        </DialogDescription>

        <ScrambleDisplay
          show={true}
          scramble={solve?.scramble || ""}
          event={selectedCube?.category || "3x3"}
          className="h-20 md:h-24 lg:h-28 xl:h-32 2xl:h-36"
          visualization="2D"
        />

        <div className="flex justify-center gap-2 text-xs">
          <Badge>
            {selectedCube?.category || 'Unknown'}
          </Badge>

          <p className="flex items-center justify-center gap-1">
            <ClockIcon />
            {DateTime.fromMillis(solve?.endTime || 0)
              .setLocale(locale)
              .toFormat("HH:mm:ss")}
          </p>
        </div>

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
