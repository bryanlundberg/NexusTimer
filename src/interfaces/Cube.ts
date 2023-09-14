import { Categories } from "./Categories";
import { Solve } from "./Solve";

export interface Cube {
  id: string;
  name: string;
  category: Categories;
  solves: Solve[];
  createdAt: number;
  favorite: boolean;
}
