import { ScrambleDisplay } from "@/components/scramble-display";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Textarea } from "@/components/ui/textarea";
import formatTime from "@/lib/formatTime";
import { useDialogSolve } from "@/store/DialogSolve";
import { useTimerStore } from "@/store/timerStore";
import {
  CalendarDaysIcon,
  DocumentDuplicateIcon,
  StarIcon,
  TrashIcon,
} from "@heroicons/react/24/solid";
import { DateTime } from "luxon";
import { useLocale } from "next-intl";
import Image from "next/image";

export default function SheetSolveDetails() {
  const { solve } = useDialogSolve();
  const { selectedCube } = useTimerStore();
  const locale = useLocale();

  return (
    <SheetContent>
      <SheetHeader>
        <SheetTitle>
          <p className="flex items-center gap-1 font-medium mx-auto">
            {selectedCube?.name} -{" "}
            {DateTime.fromMillis(solve?.endTime || 0)
              .setLocale(locale)
              .toLocaleString()}
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

        <p className="font-black text-5xl text-center mx-auto pt-5 relative">
          {formatTime(solve?.time || 0)}
        </p>

        {/* comment */}
        <div className="pt-5 flex justify-start flex-col">
          <Label className="text-start">Comment</Label>
          <Textarea className="mt-3 resize-none h-40" />
        </div>

        {/* options */}
        <div className="flex items-center justify-center pt-5">
          <Button variant={"ghost"}>
            <TrashIcon className="w-5 h-5" />
          </Button>
          <Button variant={"ghost"} className="font-black text-lg">
            +2
          </Button>
          <Button variant={"ghost"}>
            <StarIcon className="w-5 h-5" />
          </Button>
          <Button variant={"ghost"}>
            <DocumentDuplicateIcon className="w-5 h-5" />
          </Button>
        </div>

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
