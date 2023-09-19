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
import Plus from "@/icons/Plus";
import Import from "@/icons/Import";

export default function SolvesPage() {
  const [currentTab, setCurrentTab] = useState<SolveTab>("Session");
  const { selectedCube } = useTimerStore();

  const handleTabClick = (newTab: SolveTab) => {
    setCurrentTab(newTab);
  };

  const renderSolvesArea = (tab: SolveTab) => {
    const selectedSolves =
      tab === "Session"
        ? selectedCube?.solves.session
        : selectedCube?.solves.all;

    if (!selectedCube) {
      return <EmptySolves message="No cube selected." />;
    }

    if (!selectedSolves || selectedSolves.length === 0) {
      return <EmptySolves message="Nothing here yet!" />;
    }

    return (
      <div className="w-full gap-3 grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 xl:grid-cols-6">
        {selectedSolves.map((solve: Solve) => (
          <SingleSolveItem key={genId()} solve={solve} />
        ))}
      </div>
    );
  };

  return (
    <>
      <div className="w-full md:w-10/12 mx-auto mt-10">
        <div className="flex justify-between text-sm">
          {/* Options Show session/ History/bookmark */}
          <div className="font-medium rounded-md p-1 flex h-8 bg-zinc-800 gap-1 w-56">
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
              handleClick={() => console.log("a")}
              className="font-normal"
            >
              <div className="flex items-center justify-center text-xs">
                <MoveAll /> <div>Move All</div>
              </div>
            </Button>
            <Button disabled={false} handleClick={() => console.log("a")}>
              <div className="flex items-center justify-center text-xs">
                <Trash />
                <div> Trash</div>
              </div>
            </Button>
            <Button disabled={false} handleClick={() => console.log("a")}>
              <div className="flex items-center justify-center text-xs">
                <Plus />
                <div> New Solve</div>
              </div>
            </Button>
            <Button disabled={false} handleClick={() => console.log("a")}>
              <div className="flex items-center justify-center text-xs">
                <Import />
                <div> Import</div>
              </div>
            </Button>
          </div>
        </div>

        <div className="mt-8"></div>
        {renderSolvesArea(currentTab)}
      </div>
    </>
  );
}
