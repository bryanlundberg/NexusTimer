import { Categories } from "./Categories";

export interface Solve {
  id: string;
  cubeId: string;
  scramble: string;
  startTime: number;
  endTime: number;
  bookmark: boolean;
  time: number;
  rating: number;
  dnf: boolean;
  plus2: boolean;
  category: Categories;
  comment: string;
}
