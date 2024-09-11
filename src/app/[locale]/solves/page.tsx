"use client";

import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import MainCubeSelector from "@/components/MainCubeSelector";
import { SolvesArea } from "@/components/solves/SolvesArea";
import { FAKE_SESSION } from "@/FAKE_SESSION";
import { Sheet } from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useDialogSolve } from "@/store/DialogSolve";
import SheetSolveDetails from "@/components/sheets/sheet-solve-details/SheetSolveDetails";
import DropdownFilterSolves from "@/components/dropdrowns/dropdown-filter-options/dropdown-filter-options";

export default function Page() {
  const { isDialogSolveOpen, handleCloseDialogSolve } = useDialogSolve();

  return (
    <>
      {/* container */}
      <div className="max-w-5xl mx-auto p-2 flex flex-col min-h-full w-full bg-background grow">
        <Tabs defaultValue="session" className="grow">
          {/* header */}
          <Card className="w-full mb-2 border p-3 flex flex-col gap-2">
            <div className="flex justify-between">
              <h2 className="font-black text-xl">Solves</h2>
              <div className="flex items-center gap-2 w-full justify-end">
                <MainCubeSelector />
              </div>
            </div>

            <div className="flex gap-2">
              <TabsList>
                <TabsTrigger value="session">Session</TabsTrigger>
                <TabsTrigger value="all">All</TabsTrigger>
              </TabsList>
              <Input placeholder="Filter by time" />
              <DropdownFilterSolves />
            </div>
          </Card>

          <TabsContent value="session">
            <SolvesArea displaySolves={FAKE_SESSION} />
          </TabsContent>
          <TabsContent value="all">
            <SolvesArea displaySolves={FAKE_SESSION.slice(5, 20)} />
          </TabsContent>

          <Sheet open={isDialogSolveOpen} onOpenChange={handleCloseDialogSolve}>
            <SheetSolveDetails />
          </Sheet>
        </Tabs>
      </div>
    </>
  );
}
