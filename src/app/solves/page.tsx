"use client";
import EmptySolves from "@/components/EmptySolves";
import SingleSolveItem from "@/components/SingleSolveItem";
import ToggleSolvesButton from "@/components/ToggleSolvesButton";
import { Solve } from "@/interfaces/Solve";
import genId from "@/lib/genId";
import { useTimerStore } from "@/store/timerStore";
import { useState } from "react";
import { SolveTab } from "@/interfaces/types/SolveTabs";
import Button from "@/components/Button";
import MoveAll from "@/icons/MoveAll";
import Trash from "@/icons/Trash";
import findCube from "@/lib/findCube";
import updateSessions from "@/lib/updateSessions";
import deleteSession from "@/lib/deleteSession";
import Select from "@/components/Select";
import ModalSolve from "@/components/ModalSolve";
import { useSolvesStore } from "@/store/SolvesStore";
import translation from "@/translations/global.json";
import { useSettingsModalStore } from "@/store/SettingsModalStore";
import Navigation from "@/components/Navigation";

export default function SolvesPage() {
  const [currentTab, setCurrentTab] = useState<SolveTab>("Session");
  const { selectedCube, setCubes, setSelectedCube } = useTimerStore();
  const { status } = useSolvesStore();
  const { lang } = useSettingsModalStore();

  const handleTabClick = (newTab: SolveTab) => {
    setCurrentTab(newTab);
  };

  const handleMoveAll = () => {
    if (selectedCube) {
      const updateCubes = updateSessions(selectedCube);
      if (updateCubes) {
        setCubes(updateCubes);
        const updatedCube = findCube({ cubeId: selectedCube.id });
        if (updatedCube) setSelectedCube(updatedCube);
      }
    }
  };

  const handleTrashAll = () => {
    if (selectedCube) {
      const cubeSession = deleteSession(selectedCube);
      if (cubeSession) {
        setCubes(cubeSession);
        const updatedCube = findCube({ cubeId: selectedCube.id });
        if (updatedCube) setSelectedCube(updatedCube);
      }
    }
  };

  const renderSolvesArea = (tab: SolveTab) => {
    const selectedSolves =
      tab === "Session"
        ? selectedCube?.solves.session
        : selectedCube?.solves.all;

    if (!selectedCube) {
      return (
        <EmptySolves
          message={translation.solves["no-cube-selection"][lang]}
          icon="no-cube-selected"
        />
      );
    }

    if (!selectedSolves || selectedSolves.length === 0) {
      return (
        <EmptySolves
          message={translation.solves["no-solves"][lang]}
          icon="no-solves"
        />
      );
    }

    return (
      <div className="grid w-full h-full grid-cols-3 gap-3 px-3 py-3 overflow-auto sm:grid-cols-4 md:grid-cols-5 xl:grid-cols-6">
        {selectedSolves.map((solve: Solve) => (
          <SingleSolveItem key={genId()} solve={solve} />
        ))}
      </div>
    );
  };

  return (
    <>
      <div className="flex flex-col w-full min-h-full mx-auto mt-3 rounded-md grow md:max-w-6xl xl:border light:border-neutral-200 dark:border-zinc-800">
        <div className="py-4 border-b light:border-neutral-200 dark:border-zinc-800 ">
          <div className="w-full mx-auto">
            <div className="flex items-center justify-between gap-2 mx-3">
              <div className="text-2xl font-medium">
                {translation.solves["header"][lang]}
              </div>
              <Select />
            </div>
          </div>
        </div>

        {/* content */}
        <div className="flex flex-col justify-between gap-3 px-3 py-2 text-sm rounded-b-lg shadow-sm light:shadow-neutral-200 dark:shadow-zinc-800 md:flex-row">
          {/* Options Show Session / Global */}
          <div className="flex w-full h-8 gap-1 p-1 font-medium rounded-md light:bg-neutral-200 light:text-neutral-700 dark:bg-zinc-800 md:w-56 xl:w-96">
            <ToggleSolvesButton
              handleClick={() => handleTabClick("Session")}
              active={currentTab === "Session"}
            >
              {translation.solves.filter["session"][lang]}
            </ToggleSolvesButton>
            <ToggleSolvesButton
              handleClick={() => handleTabClick("All")}
              active={currentTab === "All"}
            >
              {translation.solves.filter["all"][lang]}
            </ToggleSolvesButton>
          </div>
          {/* buttons manage solves */}
          {currentTab === "Session" ? (
            <div className="flex gap-2">
              <Button
                disabled={false}
                handleClick={() => handleMoveAll()}
                className="font-normal"
              >
                <div className="flex items-center justify-center gap-2 text-xs">
                  <MoveAll /> <div>{translation.inputs["move-all"][lang]}</div>
                </div>
              </Button>
              <Button disabled={false} handleClick={() => handleTrashAll()}>
                <div className="flex items-center justify-center gap-2 text-xs">
                  <Trash />
                  <div>{translation.inputs["trash-all"][lang]}</div>
                </div>
              </Button>
            </div>
          ) : null}
        </div>
        {renderSolvesArea(currentTab)}
        {status && <ModalSolve />}
      </div>
      <Navigation />
    </>
  );
}
