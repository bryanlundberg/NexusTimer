import { useState } from "react";
import { Categories } from "@/interfaces/Categories";
import { useCubesModalStore } from "@/store/CubesModalStore";
import { useTimerStore } from "@/store/timerStore";
import calcBestTime from "@/lib/calcBestTime";
import calcAoStatistics from "@/lib/calcAoStatistics";
import { DeleteCubeDetails } from "@/interfaces/DeleteCubeDetails";
import formatTime from "@/lib/formatTime";
import useEscape from "./useEscape";
import { deleteCubeById, getAllCubes, saveCube } from "@/db/dbOperations";
import loadSettings from "@/lib/loadSettings";
import { useSettingsModalStore } from "@/store/SettingsModalStore";

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

  const { setSettings } = useSettingsModalStore();

  const {
    setCubes,
    setSelectedCube,
    setNewScramble,
    selectedCube,
    cubes,
    setTimerStatistics,
  } = useTimerStore();
  const [error, setError] = useState<boolean>(false);
  const [isDuplicate, setDuplicate] = useState<boolean>(false);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [cubeData, setCubeData] = useState<DeleteCubeDetails | null>(null);

  const defaultCubeId = loadSettings().preferences.defaultCube.cube?.id;

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

    if (!cubes) return; // Some error pending to add with message, this should actually never occur.

    const isDuplicate = cubes.some((cube) => cube.name === name.trim());

    if (isDuplicate) {
      setDuplicate(true);
      return;
    }

    await saveCube({ name, category });
    const cubesDB = await getAllCubes();
    setCubes(cubesDB);
    setModalOpen(false);
    setEditingCube(null);
    setCubeName("");
    setSelectedCategory("2x2");
  };

  const handleEditCube = async (name: string, category: Categories) => {
    if (name.trim() === "") {
      setError(true);
      return;
    }

    if (!editingCube) return;

    if (!cubes) return; // Some error pending to add with message, this should actually never occur.

    if (editingCube.name.trim() !== name.trim()) {
      const isDuplicate = cubes.some(
        (cube) => cube.name.trim() === name.trim()
      );
      if (isDuplicate) {
        setDuplicate(true);
        return;
      }
    }

    if (editingCube.id === defaultCubeId) {
      const currentSettings = loadSettings();
      if (currentSettings.preferences.defaultCube.cube) {
        currentSettings.preferences.defaultCube.cube.name = name;
        currentSettings.preferences.defaultCube.cube.category = category;
      }
      setSettings(currentSettings);
      window.localStorage.setItem("settings", JSON.stringify(currentSettings));
    }

    const updatedCube = await saveCube({
      ...editingCube,
      name: name.trim(),
      category: category,
    });

    const cubesDB = await getAllCubes();
    setCubes(cubesDB);

    if (editingCube.id === selectedCube?.id) {
      setSelectedCube(null);
      setTimerStatistics();
    }

    setModalOpen(false);
    setEditingCube(null);
    setCubeName("");
    setSelectedCategory("2x2");
  };

  const handleCubeDetails = () => {
    if (!editingCube) return;
    if (!cubes) return; // Some error pending to add with message, this should actually never occur.

    const cubeToBeDeleted = cubes.find((cube) => cube.id === editingCube.id);
    if (!cubeToBeDeleted) return;

    const name = cubeToBeDeleted ? cubeToBeDeleted.name : "Undefined";
    const solveCount = cubeToBeDeleted
      ? cubeToBeDeleted.solves.session.length +
        cubeToBeDeleted.solves.all.length
      : 0;
    const bestTime = cubeToBeDeleted
      ? calcBestTime({
          cubeName: cubeToBeDeleted.name,
          category: cubeToBeDeleted.category,
          cubesDB: cubes,
        })
      : null;
    const bestAo = cubeToBeDeleted
      ? calcAoStatistics({
          cubeName: cubeToBeDeleted.name,
          category: cubeToBeDeleted.category,
          cubesDB: cubes,
        })
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
      setTimerStatistics();
    }

    if (editingCube.id === defaultCubeId) {
      const currentSettings = loadSettings();
      currentSettings.preferences.defaultCube.cube = null;
      setSettings(currentSettings);
      window.localStorage.setItem("settings", JSON.stringify(currentSettings));
    }

    await deleteCubeById(editingCube.id);
    const cubes = await getAllCubes();
    setCubes(cubes);

    setModalOpen(false);
    setEditingCube(null);
    setCubeName("");
    setSelectedCategory("2x2");
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setEditingCube(null);
    setCubeName("");
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
    cubeData,
    handleDeleteClick,
    confirmDelete,
    cancelDelete,
    showDeleteConfirmation,
    setSelectedCategory,
  };
}
