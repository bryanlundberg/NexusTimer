import { Categories } from "@/interfaces/Categories";
import { Cube } from "@/interfaces/Cube";
import { create } from "zustand";

interface Modal {
  modalOpen: boolean;
  editingCube: Cube | null;
  cubeName: string;
  selectedCategory: Categories;
  setModalOpen: (status: boolean) => void;
  setEditingCube: (cube: Cube | null) => void;
  setCubeName: (name: string) => void;
  setSelectedCategory: (category: Categories) => void;
}

export const useCubesModalStore = create<Modal>((set) => ({
  modalOpen: false,
  editingCube: null,
  cubeName: "",
  selectedCategory: "2x2",
  setModalOpen: (status: boolean) => {
    set({ modalOpen: status });
  },
  setEditingCube: (cube: Cube | null) => {
    set({ editingCube: cube, cubeName: cube ? cube.name : "" });
  },
  setCubeName: (name: string) => {
    set({ cubeName: name });
  },
  setSelectedCategory: (category: Categories) => {
    set({ selectedCategory: category });
  },
}));
