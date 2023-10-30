import { useState } from "react";
import { Categories } from "@/interfaces/Categories";
import { useCubesModalStore } from "@/store/CubesModalStore";
import createCube from "@/lib/createCube";
import { useTimerStore } from "@/store/timerStore";
import loadCubes from "@/lib/loadCubes";
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
  const { lang } = useSettingsModalStore();
  const { setCubes } = useTimerStore();
  const [error, setError] = useState<boolean>(false);
  // Add state for the confirmation message
  const [deleteConfirmationMessage, setDeleteConfirmationMessage] = useState("");

  const handleClickRadio = (category: Categories) => {
    setSelectedCategory(category);
  };

  const handleWriteCubeName = (newText: string) => {
    if (newText.trim().length > 0) setError(false);
    setCubeName(newText);
  };

  const handleCreateCube = (name: string, category: Categories) => {
    if (name.trim() === "") {
      setError(true);
      return;
    }
    const newCubes = createCube({
      cubeName: name,
      category: category,
    });
    setCubes(newCubes);
    setModalOpen(false);
    setEditingCube(null);
    setCubeName("");
    setSelectedCategory("2x2");
  };

  const handleEditCube = (name: string, category: Categories) => {
    if (name.trim() === "") {
      setError(true);
      return;
    }
    if (!editingCube) return;
    const cubeDB = loadCubes();

    for (const cube of cubeDB) {
      if (cube.id === editingCube.id) {
        cube.name = name;
        cube.category = category;
      }
    }

    window.localStorage.setItem("cubes", JSON.stringify(cubeDB));
    setCubes(cubeDB);
    setModalOpen(false);
    setEditingCube(null);
    setCubeName("");
    setSelectedCategory("2x2");
  };

  const handleMessage = () => {
    const cubeDB = loadCubes();
    if (!editingCube) return;
    
      // Get the solve count for the cube
      const cubeToBeDeleted = cubeDB.find((cube) => cube.id === editingCube.id);
      const solveCount = cubeToBeDeleted ? cubeToBeDeleted.solves.session.length : 0;
  
      // Construct the message with the solve count
      const message = `You have solved this cube ${solveCount} time(s). Are you sure you want to delete it?`;
      // Show the delete confirmation dialog with the message
      setDeleteConfirmationMessage(message);
  }

  const handleDeleteCube = () => {
    const cubeDB = loadCubes();
    if (!editingCube) return;
    const updatedCubeDB = cubeDB.filter((cube) => cube.id !== editingCube.id);
    window.localStorage.setItem("cubes", JSON.stringify(updatedCubeDB));
    setCubes(updatedCubeDB);
    setModalOpen(false);
    setEditingCube(null);
    setCubeName("");
    setSelectedCategory("2x2");
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setEditingCube(null);
    setCubeName("");
    setSelectedCategory("2x2");
  };

  return {
    error,
    handleClickRadio,
    handleWriteCubeName,
    handleCreateCube,
    handleEditCube,
    handleDeleteCube,
    handleCloseModal,
    selectedCategory,
    cubeName,
    lang,
    handleMessage,
    deleteConfirmationMessage,
  };
}
