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

export default function SolvesPage() {
  const [currentTab, setCurrentTab] = useState<SolveTab>("Session");
  const { selectedCube, setCubes, setSelectedCube } = useTimerStore();
  const { status, setStatus } = useSolvesStore();

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
          message="No cube selected, pick one..."
          icon="no-cube-selected"
        />
      );
    }

    if (!selectedSolves || selectedSolves.length === 0) {
      return (
        <EmptySolves message="There's no solves to show!" icon="no-solves" />
      );
    }

    return (
      <div className="px-3 pb-3 w-full h-full overflow-auto gap-3 grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 xl:grid-cols-6">
        {selectedSolves.map((solve: Solve) => (
          <SingleSolveItem key={genId()} solve={solve} />
        ))}
      </div>
    );
  };

  return (
    <>
      <div className="grow w-full md:max-w-6xl mx-auto flex flex-col gap-3 border border-zinc-800 rounded-md min-h-full">
        <div className="border-b border-zinc-800 py-4 ">
          <div className="w-full mx-auto">
            <div className="flex justify-between items-center mx-3 gap-2">
              <div className="font-medium text-2xl">Solves</div>
              <Select />
            </div>
          </div>
        </div>

        {/* content */}
        <div className="px-3 flex justify-between text-sm flex-col md:flex-row gap-3">
          {/* Options Show Session / Global */}
          <div className="font-medium rounded-md p-1 flex h-8 bg-zinc-800 gap-1 w-full md:w-56 xl:w-96">
            <ToggleSolvesButton
              handleClick={() => handleTabClick("Session")}
              active={currentTab === "Session"}
            >
              Session
            </ToggleSolvesButton>
            <ToggleSolvesButton
              handleClick={() => handleTabClick("All")}
              active={currentTab === "All"}
            >
              All Time
            </ToggleSolvesButton>
          </div>
          {/* buttons manage solves */}
          <div className="flex gap-2">
            <Button
              disabled={false}
              handleClick={() => handleMoveAll()}
              className="font-normal"
            >
              <div className="flex items-center justify-center text-xs">
                <MoveAll /> <div>Move All</div>
              </div>
            </Button>
            <Button disabled={false} handleClick={() => handleTrashAll()}>
              <div className="flex items-center justify-center text-xs">
                <Trash />
                <div> Trash All</div>
              </div>
            </Button>
          </div>
        </div>
        {renderSolvesArea(currentTab)}
        {status && <ModalSolve />}
      </div>
    </>
  );
}
