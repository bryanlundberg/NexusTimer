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
import { useQueryState } from "nuqs";
import { DisplaySolvesTabs } from "@/enums/DisplaySolvesTabs";
import { STATES } from "@/constants/states";
import { useDebouncedCallback } from "use-debounce";
import FadeIn from "@/components/fade-in/fade-in";

export default function Page() {
  const { isDialogSolveOpen, handleCloseDialogSolve } = useDialogSolve();
  const { isOpenMoveSolvesDialog, handleChangeIsOpenMoveSolvesDialog } = useSolveFiltersStore();
  const selectedCube = useTimerStore((state) => state.selectedCube);
  const t = useTranslations("Index");
  const [tabMode,] = useQueryState(STATES.SOLVES_PAGE.TAB_MODE.KEY, { defaultValue : STATES.SOLVES_PAGE.TAB_MODE.DEFAULT_VALUE });
  const [, setQuery] = useQueryState(STATES.SOLVES_PAGE.QUERY.KEY, { defaultValue: STATES.SOLVES_PAGE.QUERY.DEFAULT_VALUE });
  const handleSearch = useDebouncedCallback((value) => setQuery(value), 1000);

  return (
    <FadeIn className="flex flex-col grow overflow-auto">
      {/* container */}
      <div className="max-w-7xl mx-auto px-2 pt-2 flex flex-col w-full min-h-full">
        {/* header */}
        <Navigation showMainCubeSelector showButtonDisplayType>
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
            tabMode === DisplaySolvesTabs.SESSION
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

        <Dialog open={isDialogSolveOpen} onOpenChange={handleCloseDialogSolve}>
          <SheetSolveDetails />
        </Dialog>
      </div>
    </FadeIn>
  );
}
