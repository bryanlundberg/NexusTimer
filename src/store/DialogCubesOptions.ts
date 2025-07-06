import { Cube } from "@/interfaces/Cube";
import { create } from "zustand";

type DialogCubesOptionsProps = {
  cube: Cube | null;
  type: "delete" | "edit" | null;
  isOpen: boolean;
  openDialogType: ({
    type,
    cube,
  }: {
    type: "delete" | "edit" | null;
    cube: Cube;
  }) => void;
  closeDialog: () => void;
};

export const useDialogCubesOptions = create<DialogCubesOptionsProps>((set) => ({
  cube: null,
  type: null,
  isOpen: false,
  openDialogType: ({
    type,
    cube,
  }: {
    type: "delete" | "edit" | null;
    cube: Cube;
  }) => {
    set({ isOpen: true, type, cube });
  },

  closeDialog: () => {
    set({ isOpen: false, type: null, cube: null });
  },
}));
