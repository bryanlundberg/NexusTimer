"use client";

import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import MainCubeSelector from "@/components/MainCubeSelector";
import { SolvesArea } from "@/components/solves/SolvesArea";
import { Sheet } from "@/components/ui/sheet";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useDialogSolve } from "@/store/DialogSolve";
import SheetSolveDetails from "@/components/sheets/sheet-solve-details/SheetSolveDetails";
import DropdownFilterSolves from "@/components/dropdowns/dropdown-filter-options/dropdown-filter-options";
import { useTimerStore } from "@/store/timerStore";
import { useSolveFiltersStore } from "@/store/SolvesFilters";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { EnterIcon, ExitIcon, Share2Icon } from "@radix-ui/react-icons";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useState } from "react";
import DialogMoveHistorial from "@/components/dialogs/dialog-move-historial/dialog-move-historial";
import { Dialog } from "@/components/ui/dialog";

export default function Page() {
  const { isDialogSolveOpen, handleCloseDialogSolve } = useDialogSolve();
  const { handleSearch, handleChangeTab, tab } = useSolveFiltersStore();
  const { selectedCube } = useTimerStore();
  const [isOpen, setIsOpen] = useState(false); // Used for move-historial button
  return (
    <>
      {/* container */}
      <div className="max-w-5xl mx-auto p-2 flex flex-col w-full min-h-full">
        {/* header */}
        <Card className="w-full mb-2 border p-3 flex flex-col gap-2">
          <div className="flex justify-between gap-10">
            <h2 className="font-black text-xl">Solves</h2>
            <div className="flex items-center gap-2 w-full justify-end">
              <MainCubeSelector />
            </div>
          </div>

          <div className="flex gap-2">
            <Tabs
              defaultValue="session"
              className="grow"
              onValueChange={(e: any) => handleChangeTab(e)}
            >
              <TabsList>
                <TabsTrigger value="session">Session</TabsTrigger>
                <TabsTrigger value="all">Historial</TabsTrigger>
              </TabsList>
            </Tabs>

            <Input
              placeholder="Filter by time"
              onChange={(e) => handleSearch(e.target.value)}
            />
            <TooltipProvider delayDuration={100}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant={"outline"} onClick={() => setIsOpen(true)}>
                    {tab === "session" ? <EnterIcon /> : <ExitIcon />}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Move solves to history</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <DropdownFilterSolves />
          </div>
        </Card>

        <ScrollArea>
          <SolvesArea
            displaySolves={
              tab === "session"
                ? selectedCube?.solves.session
                : selectedCube?.solves.all
            }
          />
        </ScrollArea>

        <Dialog open={isOpen} onOpenChange={() => setIsOpen(false)}>
          <DialogMoveHistorial handleClose={() => setIsOpen(false)} />
        </Dialog>

        <Sheet open={isDialogSolveOpen} onOpenChange={handleCloseDialogSolve}>
          <SheetSolveDetails />
        </Sheet>
      </div>
    </>
  );
}
