import { Categories } from "./Categories";
import { Solves } from "./Solves";

export interface Cube {
  id: string;
  name: string;
  category: Categories;
  solves: Solves;
  createdAt: number;
  favorite: boolean;
  updatedAt?: number;
  isDeleted?: boolean;
}
