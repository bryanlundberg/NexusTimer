import { Solve } from "@/interfaces/Solve";
import { SolveTab } from "@/interfaces/types/SolveTabs";
import deleteSession from "@/lib/deleteSession";
import querySolves from "@/lib/querySolves";
import finishSession from "@/lib/finishSession";
import { useTimerStore } from "@/store/timerStore";
import { useEffect, useRef, useState } from "react";
import { MoveData } from "@/components/solves/MoveModal";
import { ConfirmDeleteData } from "@/components/solves/ConfirmDelete";
import { sort } from "fast-sort";
import calcStatistics from "@/lib/calcStatistics";
import { getAllCubes, getCubeById } from "@/db/dbOperations";

export default function useSolvesPage() {
  const [currentTab, setCurrentTab] = useState<SolveTab>("Session");
  const {
    selectedCube,
    cubes,
    mergeUpdateSelectedCube,
    setCubes,
    setSelectedCube,
  } = useTimerStore();
  const [displaySolves, setDisplaySolves] = useState<Solve[] | null>(null);
  const [isOpenMoveModal, setIsOpenMoveModal] = useState(false);
  const [isOpenDeleteModal, setIsOpenDeleteModal] = useState(false);
  const searchBox = useRef<HTMLInputElement | null>(null);

  const handleTabClick = (clickedTab: SolveTab) => {
    setCurrentTab(clickedTab);
  };

  const handleGetMoveData = (): MoveData | null => {
    if (!selectedCube) return null;
    const { session } = calcStatistics({ selectedCube, cubesDB: cubes });
    return {
      category: selectedCube.category,
      bestTime: session.best,
      average: session.mean,
      count: session.count,
    };
  };

  const handleGetDeleteData = (): ConfirmDeleteData | null => {
    if (!selectedCube) return null;
    const { cubeSession } = calcStatistics({ selectedCube, cubesDB: cubes });
    return {
      category: selectedCube.category,
      bestTime: cubeSession.best,
      average: cubeSession.mean,
      count: cubeSession.count,
    };
  };

  const handleMoveAll = async () => {
    if (!selectedCube) return;
    await finishSession({ selectedCube, cubesDB: cubes });
    const cubesDB = await getAllCubes();
    setCubes(cubesDB);
    const currentCube = await getCubeById(selectedCube.id);
    setSelectedCube(currentCube);
  };

  const handleTrashAll = async () => {
    if (!selectedCube) return;
    const updatedCube = await deleteSession({ selectedCube, cubesDB: cubes });
    mergeUpdateSelectedCube(updatedCube, cubes);
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

    const solves = querySolves({
      query,
      currentTab,
      selectedCube,
      sortByTime: true,
    });
    setDisplaySolves(solves);
  };

  useEffect(() => {
    searchBox.current = document.querySelector("#search");

    let solvesToDisplay = null;

    if (selectedCube) {
      if (currentTab === "All") {
        solvesToDisplay = sort(selectedCube.solves.all).desc((u) => u.endTime);
      } else if (currentTab === "Session") {
        solvesToDisplay = sort(selectedCube.solves.session).desc(
          (u) => u.endTime
        );
      }

      if (searchBox.current && searchBox.current.value !== "") {
        solvesToDisplay = querySolves({
          query: searchBox.current.value,
          currentTab,
          selectedCube,
          sortByTime: true,
        });
      }

      setDisplaySolves(solvesToDisplay);
    }
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
