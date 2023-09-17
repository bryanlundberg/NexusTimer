import { Cube } from "@/interfaces/Cube";
import { create } from "zustand";

type CubesStore = {};

export const useCubesStore = create<CubesStore>((set) => ({}));
