import { useState } from "react";
import { Categories } from "@/interfaces/Categories";
import { useCubesModalStore } from "@/store/CubesModalStore";
import { useTimerStore } from "@/store/timerStore";
import { useSettingsModalStore } from "@/store/SettingsModalStore";
import calcBestTime from "@/lib/calcBestTime";
import calcAoStatistics from "@/lib/calcAoStatistics";
import { DeleteCubeDetails } from "@/interfaces/DeleteCubeDetails";
import formatTime from "@/lib/formatTime";
import useEscape from "./useEscape";
import {
  deleteCubeById,
  getAllCubes,
  saveBatchCubes,
  saveCube,
} from "@/db/dbOperations";

export default function useModalCube() {
  const {
    setModalOpen,
    editingCube,
    setEditingCube,
    selectedCategory,
    setSelectedCategory,
    cubeName,
    setCubeName,
  } = useCubesModalStore();

  const { lang } = useSettingsModalStore();
  const { setCubes, setSelectedCube, setNewScramble, selectedCube } =
    useTimerStore();
  const [error, setError] = useState<boolean>(false);
  const [isDuplicate, setDuplicate] = useState<boolean>(false);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [cubeData, setCubeData] = useState<DeleteCubeDetails | null>(null);

  useEscape(() => setModalOpen(false));

  const handleClickRadio = (category: Categories) => {
    setSelectedCategory(category);
  };

  const handleWriteCubeName = (newText: string) => {
    if (newText.trim().length > 0) setError(false);
    setCubeName(newText);
  };

  const handleCreateCube = async (name: string, category: Categories) => {
    if (name.trim() === "") {
      setError(true);
      return;
    }

    const cubeDB = await getAllCubes();
    const isDuplicate = cubeDB.some((cube) => cube.name === name);

    if (isDuplicate) {
      setDuplicate(true);
      return;
    }
    const newCube = await saveCube({ name, category });
    setCubes([...cubeDB, newCube]);
    setModalOpen(false);
    setEditingCube(null);
    setCubeName("");
    setSelectedCategory("2x2");
  };

  const handleEditCube = async (name: string, category: Categories) => {
    const cubeDB = await getAllCubes();
    const isDuplicate = cubeDB.some((cube) => cube.name === name);
    if (name.trim() === "") {
      setError(true);
      return;
    }
    if (isDuplicate) {
      setDuplicate(true);
      return;
    }
    if (!editingCube) return;

    for (const cube of cubeDB) {
      if (cube.id === editingCube.id) {
        cube.name = name;
        cube.category = category;
      }
      if (editingCube.id === selectedCube?.id) {
        setSelectedCube(null);
      }
    }

    await saveBatchCubes(cubeDB);
    setCubes(cubeDB);
    setModalOpen(false);
    setEditingCube(null);
    setCubeName("");
    setSelectedCategory("2x2");
  };

  const handleCubeDetails = async () => {
    if (!editingCube) return;
    const cubeDB = await getAllCubes();
    const cubeToBeDeleted = cubeDB.find((cube) => cube.id === editingCube.id);
    if (!cubeToBeDeleted) return;
    const name = cubeToBeDeleted ? cubeToBeDeleted.name : "Undefined";
    const solveCount = cubeToBeDeleted
      ? cubeToBeDeleted.solves.session.length +
        cubeToBeDeleted.solves.all.length
      : 0;
    const bestTime = cubeToBeDeleted
      ? await calcBestTime(cubeToBeDeleted.category, cubeToBeDeleted.name)
      : null;
    const bestAo = cubeToBeDeleted
      ? await calcAoStatistics(cubeToBeDeleted.category, cubeToBeDeleted.name)
      : null;

    setCubeData({
      name: name,
      category: cubeToBeDeleted.category,
      count: solveCount,
      best: bestTime ? formatTime(bestTime.cubeAll) : "--",
      ao5: bestAo ? formatTime(bestAo.cubeAll.ao5) : "--",
    });
  };

  const handleDeleteCube = async () => {
    if (!editingCube) return;

    if (selectedCube && selectedCube.id === editingCube.id) {
      setSelectedCube(null);
      setNewScramble(null);
    }

    await deleteCubeById(editingCube.id);
    const cubeDB = await getAllCubes();

    setCubes(cubeDB);
    setModalOpen(false);
    setEditingCube(null);
    setCubeName("");
    setSelectedCategory("2x2");
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setEditingCube(null);
    setCubeName("");
    // setSelectedCategory("2x2");
  };

  const handleDeleteClick = () => {
    // Show the delete confirmation dialog
    handleCubeDetails();
    setShowDeleteConfirmation(true);
  };

  const confirmDelete = () => {
    // User confirmed deletion, call the handleDeleteCube function
    handleDeleteCube();
    setShowDeleteConfirmation(false);
  };

  const cancelDelete = () => {
    // User canceled deletion, hide the confirmation dialog
    setShowDeleteConfirmation(false);
  };

  return {
    error,
    isDuplicate,
    handleClickRadio,
    handleWriteCubeName,
    handleCreateCube,
    handleEditCube,
    handleDeleteCube,
    handleCloseModal,
    selectedCategory,
    cubeName,
    lang,
    cubeData,
    handleDeleteClick,
    confirmDelete,
    cancelDelete,
    showDeleteConfirmation,
    setSelectedCategory,
  };
}
