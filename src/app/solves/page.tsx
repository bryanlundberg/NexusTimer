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

export default function SolvesPage() {
  const { handleTabClick, currentTab, handleMoveAll, handleTrashAll } =
    useSolvesPage();
  const { lang } = useSettingsModalStore();

  return (
    <>
      <OverallContainer>
        <OverallHeader title={translation.solves["header"][lang]}>
          <Select />
        </OverallHeader>

        <SolveFilters>
          <Filter handleClick={handleTabClick} currentTab={currentTab} />
          <ButtonsSection currentTab={currentTab}>
            <Button
              onClick={() => handleMoveAll()}
              icon={<MoveAll />}
              label={translation.inputs["move-all"][lang]}
            />
            <Button
              onClick={() => handleTrashAll()}
              icon={<Trash />}
              label={translation.inputs["trash-all"][lang]}
            />
          </ButtonsSection>
        </SolveFilters>
        <SolvesArea currentTab={currentTab} />
        <ModalSolve />
      </OverallContainer>
    </>
  );
}
