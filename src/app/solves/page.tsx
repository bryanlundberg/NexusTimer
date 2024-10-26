"use client";
import { Input } from "@/components/ui/input";
import { SolvesArea } from "@/components/solves/SolvesArea";
import { Sheet } from "@/components/ui/sheet";
import { useDialogSolve } from "@/store/DialogSolve";
import SheetSolveDetails from "@/components/sheets/sheet-solve-details/SheetSolveDetails";
import DropdownFilterSolves from "@/components/dropdowns/dropdown-filter-options/dropdown-filter-options";
import { useTimerStore } from "@/store/timerStore";
import { useSolveFiltersStore } from "@/store/SolvesFilters";
import DialogMoveHistorial from "@/components/dialogs/dialog-move-historial/dialog-move-historial";
import { Dialog } from "@/components/ui/dialog";
import { useTranslations } from "next-intl";
import Navigation from "@/components/navigation/navigation";
import ButtonMoveSolves from "@/components/navigation/buttons/button-move-solves";

export default function Page() {
  const { isDialogSolveOpen, handleCloseDialogSolve } = useDialogSolve();
  const {
    handleSearch,
    tab,
    isOpenMoveSolvesDialog,
    handleChangeIsOpenMoveSolvesDialog,
  } = useSolveFiltersStore();
  const { selectedCube } = useTimerStore();
  const t = useTranslations("Index");
  return (
    <>
      {/* container */}
      <div className="max-w-7xl mx-auto px-2 pt-2 flex flex-col w-full min-h-full overflow-auto">
        {/* header */}
        <Navigation>
          <div className="flex gap-2">
            <ButtonMoveSolves />
            <Input
              placeholder={t("SolvesPage.filter-by-time")}
              onChange={(e) => handleSearch(e.target.value)}
              className="bg-background"
            />
            <DropdownFilterSolves />
          </div>
        </Navigation>

        <SolvesArea
          displaySolves={
            tab === "session"
              ? selectedCube?.solves.session
              : selectedCube?.solves.all
          }
        />

        <Dialog
          open={isOpenMoveSolvesDialog}
          onOpenChange={() => handleChangeIsOpenMoveSolvesDialog()}
        >
          <DialogMoveHistorial
            handleClose={() => handleChangeIsOpenMoveSolvesDialog()}
          />
        </Dialog>

        <Sheet open={isDialogSolveOpen} onOpenChange={handleCloseDialogSolve}>
          <SheetSolveDetails />
        </Sheet>
      </div>
    </>
  );
}
