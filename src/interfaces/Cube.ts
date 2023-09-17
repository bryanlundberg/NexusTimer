import { Categories } from "./Categories";
import { Solve } from "./Solve";
import { Solves } from "./Solves";

export interface Cube {
  id: string;
  name: string;
  category: Categories;
  solves: Solves;
  createdAt: number;
  favorite: boolean;
}
