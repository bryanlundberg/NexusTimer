import { Solve } from "@/interfaces/Solve";
import { SolveTab } from "@/interfaces/types/SolveTabs";
import deleteSession from "@/lib/deleteSession";
import findCube from "@/lib/findCube";
import searchQuery from "@/lib/searchQuery";
import updateSessions from "@/lib/updateSessions";
import { useTimerStore } from "@/store/timerStore";
import { useEffect, useRef, useState } from "react";
import { useTimerStatistics } from "./useTimerStatistics";
import { MoveData } from "@/components/solves/MoveModal";
import { ConfirmDeleteData } from "@/components/solves/ConfirmDelete";

export default function useSolvesPage() {
  const [currentTab, setCurrentTab] = useState<SolveTab>("Session");
  const { selectedCube, setCubes, setSelectedCube, cubes } = useTimerStore();
  const [displaySolves, setDisplaySolves] = useState<Solve[] | null>(null);
  const [isOpenMoveModal, setIsOpenMoveModal] = useState(false);
  const [isOpenDeleteModal, setIsOpenDeleteModal] = useState(false);
  const { session, cubeSession } = useTimerStatistics();
  const searchBox = useRef<any>(null);

  const handleTabClick = (clickedTab: SolveTab) => {
    setCurrentTab(clickedTab);
  };

  const handleGetMoveData = (): MoveData | null => {
    if (!selectedCube) return null;
    return {
      category: selectedCube.category,
      bestTime: session.best,
      average: session.mean,
      count: session.count,
    };
  };

  const handleGetDeleteData = (): ConfirmDeleteData | null => {
    if (!selectedCube) return null;
    return {
      category: selectedCube.category,
      bestTime: cubeSession.best,
      average: cubeSession.mean,
      count: cubeSession.count,
    };
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
    if (!selectedCube) return null;
    if (query === "") {
      if (currentTab === "All") {
        setDisplaySolves(selectedCube.solves.all);
      } else if (currentTab === "Session") {
        setDisplaySolves(selectedCube.solves.session);
      }
      return;
    }

    const solves = searchQuery({
      query,
      currentTab,
      cubeId: selectedCube.id,
      sortByTime: true,
    });
    setDisplaySolves(solves);
  };

  useEffect(() => {
    searchBox.current = document.querySelector("#search");

    let solvesToDisplay = null;

    if (selectedCube) {
      if (currentTab === "All") {
        solvesToDisplay = selectedCube.solves.all;
      } else if (currentTab === "Session") {
        solvesToDisplay = selectedCube.solves.session;
      }

      if (searchBox.current.value !== "") {
        const results = searchQuery({
          query: searchBox.current.value,
          currentTab,
          cubeId: selectedCube.id,
          sortByTime: true,
        });

        if (results) {
          solvesToDisplay = results;
        }
      }

      setDisplaySolves(solvesToDisplay);
    }
  }, [currentTab, selectedCube, cubes]);

  return {
    currentTab,
    setCurrentTab,
    handleTabClick,
    handleMoveAll,
    handleTrashAll,
    handleSearch,
    displaySolves,
    isOpenMoveModal,
    setIsOpenMoveModal,
    handleGetMoveData,
    handleGetDeleteData,
    setIsOpenDeleteModal,
    isOpenDeleteModal,
  };
}
