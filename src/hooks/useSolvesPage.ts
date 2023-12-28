import { Solve } from "@/interfaces/Solve";
import { SolveTab } from "@/interfaces/types/SolveTabs";
import deleteSession from "@/lib/deleteSession";
import findCube from "@/lib/findCube";
import formatTime from "@/lib/formatTime";
import updateSessions from "@/lib/updateSessions";
import { useTimerStore } from "@/store/timerStore";
import { useState } from "react";

export default function useSolvesPage() {
  const [currentTab, setCurrentTab] = useState<SolveTab>("Session");
  const { selectedCube, setCubes, setSelectedCube, cubes } = useTimerStore();
  const [displaySolves, setDisplaySolves] = useState<Solve[] | null>(null);

  const handleTabClick = (clickedTab: SolveTab) => {
    setCurrentTab(clickedTab);
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

  const handleSearch = (query: string) => {
    if (!cubes) return;
    if (!selectedCube) return;

    const solves = selectedCube.solves.session.filter((u) => {
      console.log(
        formatTime(u.time),
        query,
        formatTime(u.time).includes(query)
      );
      if (formatTime(u.time).includes(query)) {
        return u;
      }
    });

    return solves;
  };

  return {
    currentTab,
    setCurrentTab,
    handleTabClick,
    handleMoveAll,
    handleTrashAll,
    handleSearch,
  };
}
