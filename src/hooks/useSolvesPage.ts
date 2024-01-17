import { Solve } from "@/interfaces/Solve";
import { SolveTab } from "@/interfaces/types/SolveTabs";
import deleteSession from "@/lib/deleteSession";
import querySolves from "@/lib/querySolves";
import finishSession from "@/lib/finishSession";
import { useTimerStore } from "@/store/timerStore";
import { useEffect, useRef, useState } from "react";
import { useTimerStatistics } from "./useTimerStatistics";
import { MoveData } from "@/components/solves/MoveModal";
import { ConfirmDeleteData } from "@/components/solves/ConfirmDelete";
import { getCubeById } from "@/db/dbOperations";
import { sort } from "fast-sort";

export default function useSolvesPage() {
  const [currentTab, setCurrentTab] = useState<SolveTab>("Session");
  const { selectedCube, setSelectedCube } = useTimerStore();
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

  const handleMoveAll = async () => {
    if (selectedCube) {
      await finishSession(selectedCube);
      const updatedCube = await getCubeById(selectedCube.id);
      await setSelectedCube(updatedCube);
    }
  };

  const handleTrashAll = async () => {
    if (selectedCube) {
      await deleteSession(selectedCube);
      const updatedCube = await getCubeById(selectedCube.id);
      await setSelectedCube(updatedCube);
    }
  };

  const handleSearch = async (query: string) => {
    if (!selectedCube) return null;
    if (query === "") {
      if (currentTab === "All") {
        setDisplaySolves(selectedCube.solves.all);
      } else if (currentTab === "Session") {
        setDisplaySolves(selectedCube.solves.session);
      }
      return;
    }

    const solves = await querySolves({
      query,
      currentTab,
      cubeId: selectedCube.id,
      sortByTime: true,
    });
    setDisplaySolves(solves);
  };

  useEffect(() => {
    const fetchData = async () => {
      searchBox.current = document.querySelector("#search");

      let solvesToDisplay = null;

      if (selectedCube) {
        if (currentTab === "All") {
          solvesToDisplay = sort(selectedCube.solves.all).desc(
            (u) => u.endTime
          );
        } else if (currentTab === "Session") {
          solvesToDisplay = sort(selectedCube.solves.session).desc(
            (u) => u.endTime
          );
        }

        if (searchBox.current.value !== "") {
          solvesToDisplay = await querySolves({
            query: searchBox.current.value,
            currentTab,
            cubeId: selectedCube.id,
            sortByTime: true,
          });
        }

        setDisplaySolves(solvesToDisplay);
      }
    };

    fetchData();
  }, [currentTab, selectedCube]);

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
