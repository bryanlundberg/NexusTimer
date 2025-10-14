'use client';
import { Input } from '@/components/ui/input';
import { SolvesArea } from '@/components/solves/SolvesArea';
import { useDialogSolve } from '@/store/DialogSolve';
import SheetSolveDetails from '@/components/sheets/sheet-solve-details/SheetSolveDetails';
import DropdownFilterSolves from '@/components/dropdowns/dropdown-filter-options/dropdown-filter-options';
import { useTimerStore } from '@/store/timerStore';
import { useSolveFiltersStore } from '@/store/SolvesFilters';
import DialogMoveHistorial from '@/components/dialogs/dialog-move-historial/dialog-move-historial';
import { Dialog } from '@/components/ui/dialog';
import { useTranslations } from 'next-intl';
import Navigation from '@/components/navigation/navigation';
import ButtonMoveSolves from '@/components/navigation/buttons/button-move-solves';
import { useQueryState } from 'nuqs';
import { STATES } from '@/constants/states';
import { useDebouncedCallback } from 'use-debounce';
import FadeIn from '@/components/fade-in/fade-in';
import { DisplaySolvesTabs } from '@/enums/DisplaySolvesTabs';
import { useMemo } from 'react';

export default function Page() {
  const isDialogSolveOpen = useDialogSolve((state) => state.isDialogSolveOpen);
  const handleCloseDialogSolve = useDialogSolve((state) => state.handleCloseDialogSolve);
  const isOpenMoveSolvesDialog = useSolveFiltersStore((state) => state.isOpenMoveSolvesDialog);
  const handleChangeIsOpenMoveSolvesDialog = useSolveFiltersStore((state) => state.handleChangeIsOpenMoveSolvesDialog);
  const selectedCube = useTimerStore((state) => state.selectedCube);
  const t = useTranslations('Index');
  const [tabMode,] = useQueryState(STATES.SOLVES_PAGE.TAB_MODE.KEY, { defaultValue: STATES.SOLVES_PAGE.TAB_MODE.DEFAULT_VALUE });
  const [, setQuery] = useQueryState(STATES.SOLVES_PAGE.QUERY.KEY, { defaultValue: STATES.SOLVES_PAGE.QUERY.DEFAULT_VALUE });
  const handleSearch = useDebouncedCallback((value) => setQuery(value), 1000);

  const displaySolves = useMemo(() => {
    if (!selectedCube) return [];
    const solves = tabMode === DisplaySolvesTabs.SESSION
      ? selectedCube.solves.session
      : selectedCube.solves.all;
    return solves.filter(solve => !solve.isDeleted);
  }, [selectedCube, tabMode]);

  return (
    <div className={'h-dvh flex flex-col'}>
      <FadeIn>
        <div className="px-2 pt-2 flex flex-col w-full">
          <Navigation showMainCubeSelector showButtonDisplayType>
            <div className="flex gap-2">
              <ButtonMoveSolves/>
              <Input
                placeholder={t('SolvesPage.filter-by-time')}
                onChange={(e) => handleSearch(e.target.value)}
                className="bg-background"
              />
              <DropdownFilterSolves/>
            </div>
          </Navigation>
        </div>
      </FadeIn>

      <div className="flex-1 min-h-0">
        <div className="px-2">
          <SolvesArea
            displaySolves={displaySolves}
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
            <SheetSolveDetails/>
          </Dialog>
        </div>
      </div>
    </div>
  );
}
