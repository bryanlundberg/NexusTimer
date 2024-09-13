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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import formatTime from "@/lib/formatTime";
import { useDialogSolve } from "@/store/DialogSolve";
import { useTimerStore } from "@/store/timerStore";
import {
  BookmarkIcon,
  CalendarIcon,
  ClockIcon,
  CodeSandboxLogoIcon,
  CopyIcon,
  TrashIcon,
} from "@radix-ui/react-icons";
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
            <CodeSandboxLogoIcon />
            {selectedCube?.name}
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
              .toFormat("HH:mm")}
          </p>
        </div>

        {/* comment */}
        <div className="pt-5 flex justify-start flex-col">
          <Label className="text-start">Comment</Label>
          <Textarea className="mt-3 resize-none h-40" />
        </div>

        {/* options */}
        <div className="flex items-center justify-center pt-5 gap-2">
          <TooltipProvider delayDuration={100}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant={"destructive"} className="me-10">
                  <TrashIcon className="w-4 h-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Delete</p>
              </TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant={"ghost"} className="font-light text-md">
                  +2
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>+2 Penalty</p>
              </TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant={"ghost"}>
                  <BookmarkIcon className="w-4 h-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Bookmark</p>
              </TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant={"ghost"}>
                  <CopyIcon className="w-4 h-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Copy</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
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
