import MenuSolveOptions from "@/components/menu-solve-options/menu-solve-options";
import { ScrambleDisplay } from "@/components/scramble-display";
import {
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import formatTime from "@/lib/formatTime";
import { useDialogSolve } from "@/store/DialogSolve";
import { useTimerStore } from "@/store/timerStore";
import {
  CalendarIcon,
  ClockIcon,
  CodeSandboxLogoIcon,
} from "@radix-ui/react-icons";
import { DateTime } from "luxon";
import { useLocale } from "next-intl";
import Image from "next/image";

export default function SheetSolveDetails() {
  const { handleCloseDialogSolve } = useDialogSolve();
  const { solve } = useDialogSolve();
  const { selectedCube } = useTimerStore();
  const locale = useLocale();

  return (
    <SheetContent>
      <SheetHeader>
        <SheetTitle>
          <p className="flex items-center gap-1 font-medium mx-auto">
            <CodeSandboxLogoIcon />
            {selectedCube?.name}
            {solve?.plus2 && (
              <span className="text-destructive text-sm font-black">+2</span>
            )}
          </p>
        </SheetTitle>

        <SheetDescription className="text-md text-start">
          {solve?.scramble}
        </SheetDescription>

        <ScrambleDisplay
          show={true}
          scramble={solve?.scramble || ""}
          event={selectedCube?.category || "3x3"}
          className="h-40"
          visualization="3D"
        />

        <div className="tracking-wider font-black  text-center mx-auto pt-5">
          <span className="text-5xl">
            {formatTime(solve?.time || 0).split(".")[0]}
          </span>
          <span className="text-4xl">
            .{formatTime(solve?.time || 0).split(".")[1]}
          </span>
        </div>

        <div className="flex justify-center gap-2 text-xs">
          <p className="flex items-center justify-center gap-1">
            <CalendarIcon />
            {DateTime.fromMillis(solve?.endTime || 0)
              .setLocale(locale)
              .toLocaleString()}
          </p>
          <p className="flex items-center justify-center gap-1">
            <ClockIcon />
            {DateTime.fromMillis(solve?.endTime || 0)
              .setLocale(locale)
              .toFormat("HH:mm:ss")}
          </p>
        </div>

        {/* comment */}
        {/* <div className="pt-5 flex justify-start flex-col">
          <Label className="text-start">Comment</Label>
          <Textarea className="mt-3 resize-none h-40" />
        </div> */}

        {solve && (
          <MenuSolveOptions
            solve={solve}
            onDeleteSolve={handleCloseDialogSolve}
            caseOfUse="modal-solve"
          />
        )}

        <Image
          src={"/brand_logo.svg"}
          alt="logo nexustimer"
          width={170}
          height={80}
          className="object-scale-down mx-auto pt-10"
        />
      </SheetHeader>
    </SheetContent>
  );
}
