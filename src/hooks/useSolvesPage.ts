import { SolveTab } from "@/interfaces/types/SolveTabs";
import deleteSession from "@/lib/deleteSession";
import findCube from "@/lib/findCube";
import updateSessions from "@/lib/updateSessions";
import { useTimerStore } from "@/store/timerStore";
import { useState } from "react";

export default function useSolvesPage() {
  const [currentTab, setCurrentTab] = useState<SolveTab>("Session");
  const { selectedCube, setCubes, setSelectedCube } = useTimerStore();

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

  return {
    currentTab,
    setCurrentTab,
    handleTabClick,
    handleMoveAll,
    handleTrashAll,
  };
}
