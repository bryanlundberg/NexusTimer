"use client";
import { Button } from "@/components/button/index";
import MoveAll from "@/icons/MoveAll";
import Trash from "@/icons/Trash";
import Select from "@/components/Select";
import ModalSolve from "@/components/solves/ModalSolve";
import translation from "@/translations/global.json";
import { useSettingsModalStore } from "@/store/SettingsModalStore";
import { OverallContainer } from "@/components/OverallContainer";
import { OverallHeader } from "@/components/OverallHeader";
import { SolveFilters } from "@/components/solves/SolveFilters";
import { Filter } from "@/components/solves/Filter";
import { ButtonsSection } from "@/components/solves/ButtonsSection";
import { SolvesArea } from "@/components/solves/SolvesArea";
import useSolvesPage from "@/hooks/useSolvesPage";
import { InputText } from "@/components/input-text/index";
import { useTimerStore } from "@/store/timerStore";
import MoveModal from "@/components/solves/MoveModal";

export default function SolvesPage() {
  const {
    handleTabClick,
    currentTab,
    handleMoveAll,
    handleTrashAll,
    handleSearch,
    displaySolves,
    isOpenMoveModal,
    setIsOpenMoveModal,
    handleGetMoveData,
  } = useSolvesPage();
  const { selectedCube } = useTimerStore();
  const { lang } = useSettingsModalStore();

  return (
    <>
      <OverallContainer>
        <OverallHeader title={translation.solves["header"][lang]}>
          <Select />
        </OverallHeader>

        <SolveFilters>
          <Filter handleClick={handleTabClick} currentTab={currentTab} />
          <div className="flex gap-3 grow">
            <InputText
              className="border light:bg-neutral-50 light:border-neutral-200 light:focus:bg-white dark:bg-zinc-950 dark:border-zinc-800 dark:focus:bg-zinc-900"
              placeholder="⏱︎ Search by time"
              onChange={(e) => {
                handleSearch(e);
              }}
              id="search"
            />
            <ButtonsSection currentTab={currentTab}>
              <Button
                onClick={() => setIsOpenMoveModal(true)}
                icon={<MoveAll />}
                label={translation.inputs["move-all"][lang]}
                isDisabled={
                  selectedCube === null ||
                  selectedCube.solves.session.length === 0
                }
              />
              <Button
                onClick={() => handleTrashAll()}
                icon={
                  <div className="w-4 h-4">
                    <Trash />
                  </div>
                }
                label={translation.inputs["trash-all"][lang]}
                isDisabled={
                  selectedCube === null ||
                  selectedCube.solves.session.length === 0
                }
              />
            </ButtonsSection>
          </div>
        </SolveFilters>
        <SolvesArea displaySolves={displaySolves} />
        <ModalSolve />
      </OverallContainer>
      {isOpenMoveModal && (
        <MoveModal
          onCancel={() => setIsOpenMoveModal(false)}
          onConfirm={() => {
            setIsOpenMoveModal(false);
            handleMoveAll();
          }}
          data={handleGetMoveData}
        />
      )}
    </>
  );
}
