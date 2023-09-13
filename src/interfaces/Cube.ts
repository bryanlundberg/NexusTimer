import { Categories } from "./Categories";
import { Solve } from "./Solve";

export interface Cube {
  id: number;
  name: string;
  category: Categories;
  solves: Solve[];
}
